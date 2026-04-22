import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './order.schema';
import { Model } from 'mongoose';
import { Cart } from 'src/cart/cart.schema';
import { Settings } from 'src/settings/settings.schema';

import Stripe from 'stripe';
import { ApiFeatures } from 'src/utils/api-features.utils';

@Injectable()
export class OrderService {
  [x: string]: any;
  private stripe: Stripe;
  constructor(
    @InjectModel('Order') private OrderModel: Model<Order>,
    @InjectModel('Cart') private CartModel: Model<Cart>,
    @InjectModel('Settings') private SettingsModel: Model<Settings>,
  ) {
    const secret = process.env.STRIPE_SECRET_KEY;

    if (!secret) {
      throw new Error('ST_SECRET is not defined');
    }

    this.stripe = new Stripe(secret, {});
  }

  async create(createOrderDto: CreateOrderDto, userId: string) {
    const cart = await this.CartModel.findOne({ userId }).populate({
      path: 'cartItems.productId',
      select: 'title',
    });

    if (!cart || cart.cartItems.length === 0) {
      throw new NotFoundException('Cart is empty');
    }
    let settings = await this.SettingsModel.findOne();
    if (!settings) {
      settings = await this.SettingsModel.create({});
    }

    const shippingPrice = settings.shippingPrice;
    const taxPercentage = settings.taxPercentage;

    let subtotal = 0;

    const orderItems = cart.cartItems.map((item: any) => {
      const price = item.price;

      subtotal += price * item.quantity;

      return {
        product: item.productId,
        title: item.productId.title,
        quantity: item.quantity,
        price,
      };
    });

    let discount = 0;
    if (cart.totalPriceAfterDiscount) {
      discount = subtotal - cart.totalPriceAfterDiscount;
    }
    console.log(discount);

    const taxPrice = ((subtotal - discount) * taxPercentage) / 100;
    const totalOrderPrice = subtotal + taxPrice + shippingPrice - discount;

    let data = {
      user: userId,
      cartItems: orderItems,
      taxPrice,
      shippingPrice,
      totalOrderPrice,
      shippingAddress: createOrderDto.shippingAddress,
    };

    if (createOrderDto.paymentMethodType === 'cash') {
      const order = await this.OrderModel.create({
        ...data,
        paymentMethodType: 'cash',
        isPaid: false,
        isDelivered: false,
      });
      await this.CartModel.findOneAndUpdate(
        { userId },
        {
          $set: { cartItems: [], totalPrice: 0, totalPriceAfterDiscount: 0 },
          $unset: { coupon: '' },
        },
      );

      return {
        status: 'success',
        message: 'Order created successfully (Cash)',
        data: order,
      };
    }

    if (createOrderDto.paymentMethodType === 'card') {
      const order = await this.OrderModel.create({
        ...data,
        paymentMethodType: 'card',
        isPaid: false,
        isDelivered: false,
      });

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',

        line_items: [
          ...orderItems.map((item) => ({
            price_data: {
              currency: 'egp',
              product_data: {
                name: item.title || 'Product',
              },
              unit_amount: item.price * 100,
            },
            quantity: item.quantity,
          })),
          {
            price_data: {
              currency: 'egp',
              product_data: {
                name: 'Shipping Fee',
              },
              unit_amount: shippingPrice * 100,
            },
            quantity: 1,
          },
          {
            price_data: {
              currency: 'egp',
              product_data: {
                name: 'Tax',
              },
              unit_amount: taxPrice * 100,
            },
            quantity: 1,
          },
        ],

        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cancel',

        metadata: {
          orderId: order._id.toString(),
          userId: userId.toString(),
        },
      });
      return {
        status: 'success',
        message: 'Stripe session created',
        url: session.url,
      };
    }
    throw new BadRequestException('Invalid payment method');
  }

  async findAll(query: any, user: { _id: string; role: string }) {
    const filter = user.role === 'admin' ? {} : { user: user._id };

    const feature = new ApiFeatures<Order>(this.OrderModel.find(filter), query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const orders = await feature.query;
    return {
      status: 'success',
      results: orders.length,
      data: orders,
    };
  }

  async findOne(id: string, user: { _id: string; role: string }) {
    const filter =
      user.role === 'admin' ? { _id: id } : { _id: id, user: user._id };

    const order = await this.OrderModel.findOne(filter)
      .populate({
        path: 'cartItems.product',
        select: 'title imageCover color',
      })
      .lean();

    if (!order) {
      throw new NotFoundException('order not found');
    }
    return {
      status: 'success',
      data: order,
    };
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    if (updateOrderDto.isDelivered === true) {
      (updateOrderDto as any).deliveredAt = new Date();
    }
    if (updateOrderDto.isPaid === true) {
      (updateOrderDto as any).paidAt = new Date();
    }
    const order = await this.OrderModel.findByIdAndUpdate(id, updateOrderDto, {
      new: true,
      runValidators: true,
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return {
      status: 'success',
      message: 'order updated successfully',
      data: order,
    };
  }

  async remove(id: string) {
    const order = await this.OrderModelrderModel.findByIdAndDelete(id);
    if (!order) {
      throw new NotFoundException('order not found');
    }
    return {
      status: 'success',
      message: 'order removed successfully',
    };
  }

  /////
  async handleWebhook(
    body: Buffer,
    sig: string,
    endpointSecret: string | undefined,
  ) {
    if (!endpointSecret) {
      throw new BadRequestException('Missing STRIPE_WEBHOOK_SECRET');
    }

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
      throw new BadRequestException(
        `Webhook signature verification failed: ${err.message}`,
      );
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;

        if (!orderId) {
          throw new BadRequestException('No orderId in metadata');
        }

        await this.markOrderAsPaid(orderId, session);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await this.markOrderAsFailed(paymentIntent);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return { received: true };
  }

  private async markOrderAsPaid(
    orderId: string,
    session: Stripe.Checkout.Session,
  ) {
    await this.OrderModel.findByIdAndUpdate(orderId, {
      isPaid: true,
      paidAt: new Date(),
      paymentIntentId: session.payment_intent,
      paidAmount: session.amount_total,
      currency: session.currency,
    });
  }

  private async markOrderAsFailed(paymentIntent: Stripe.PaymentIntent) {
    await this.OrderModel.findOneAndUpdate(
      { paymentIntentId: paymentIntent.id },
      { paymentFailed: true },
    );
  }
}

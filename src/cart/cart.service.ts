import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './cart.schema';
import { Product } from 'src/product/product.schema';
import { error } from 'console';
import path from 'path';

@Injectable()
export class CartService {
  constructor(
    @InjectModel('Cart') private readonly cartModel: Model<Cart>,
    @InjectModel('product') private readonly productModel: Model<Product>,
  ) {}

  // async addToCart(createCartDto: CreateCartDto, userId: string) {
  //     const { productId, quantity, color } = createCartDto;
  //     const product = await this.productModel.findById(productId);

  //     if (!product) {
  //       throw new NotFoundException('Product not found');
  //     }
  //     const price = product.price;

  //     const cart = await this.cartModel.findOne({ userId });

  //     if (!cart) {
  //       const newCart = new this.cartModel({
  //         userId,
  //         cartItems: [{ productId, quantity, color: color || '', price }],
  //         totalPrice: price * quantity,
  //       });
  //       await newCart.save();
  //       await newCart.populate({
  //         path: 'cartItems.productId',
  //         select: 'title',
  //       });

  //       return {
  //         status: 'success',
  //         message: 'Product added to cart successfully',
  //         data: newCart,
  //       };
  //     }

  //     const existingItemIndex = cart.cartItems.findIndex(
  //       (item) =>
  //         item.productId.toString() === productId &&
  //         (item.color || '') === (color || ''),
  //     );
  //     if (existingItemIndex > -1) {
  //       cart.cartItems[existingItemIndex].quantity += quantity;
  //     } else {
  //       cart.cartItems.push({ productId, quantity, color: color || '', price });
  //     }
  //     const totalPrice = cart.cartItems.reduce((total, item) => {
  //       return total + item.price * item.quantity;
  //     }, 0);

  //     cart.totalPrice = totalPrice;

  //     let discount = 0;

  //     if (cart.coupon) {
  //       discount = cart.coupon.discount || 0;
  //     }

  //     const totalPriceAfterDiscount = totalPrice - (totalPrice * discount) / 100;

  //     cart.totalPriceAfterDiscount = Math.max(0, totalPriceAfterDiscount);

  //     await cart.save();
  //     await cart.populate({
  //       path: 'cartItems.productId',
  //       select: 'title',
  //     });
  //     return {
  //       status: 'success',
  //       message: 'Product added to cart successfully',
  //       data: cart,
  //     };
  //   }

  //version 2 with MongoDB Atomic Operators to

  async addToCart(createCartDto: CreateCartDto, userId: string) {
    const { productId, quantity } = createCartDto;

    const product = await this.productModel.findById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    const price = product.price;

    let cart = await this.cartModel.findOneAndUpdate(
      {
        userId,
        cartItems: {
          $elemMatch: {
            productId,
          },
        },
      },
      {
        $inc: { 'cartItems.$.quantity': quantity },
      },
      { new: true },
    );

    if (!cart) {
      cart = await this.cartModel.findOneAndUpdate(
        { userId },
        {
          $push: {
            cartItems: { productId, quantity, price },
          },
        },
        { upsert: true, new: true },
      );
    }

    if (!cart) {
      throw new NotFoundException('Failed to initialize cart');
    }

    const totalPrice = cart.cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    const discount = cart.coupon?.discount || 0;
    const discountAmount = (totalPrice * discount) / 100;

    cart.totalPrice = totalPrice;
    cart.totalPriceAfterDiscount = Math.max(0, totalPrice - discountAmount);

    await cart.save();
    await cart.populate({
      path: 'cartItems.productId',
      select: 'title color',
    });
    return {
      status: 'success',
      message: 'Product added to cart successfully',
      data: cart,
    };
  }

  async findOne(id: string, user: { _id: string; role: string }) {
    const filter =
      user.role === 'admin' ? { _id: id } : { _id: id, userId: user._id };

    const cart = await this.cartModel
      .findOne(filter)
      .populate({
        path: 'cartItems.productId',
        select: 'title imageCover color',
      })
      .lean();

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    return {
      status: 'success',
      data: cart,
    };
  }

  async update(
    productId: string,
    updateCartDto: UpdateCartDto,
    userId: string,
  ) {
    const { quantity } = updateCartDto;
    let cart;
    if (quantity === 0) {
      cart = await this.cartModel.findOneAndUpdate(
        { userId, cartItems: { productId } },
        {
          $pull: {
            cartItems: {
              productId,
            },
          },
        },
        { new: true },
      );
    } else {
      cart = await this.cartModel.findOneAndUpdate(
        {
          userId,
          'cartItems.productId': productId,
        },
        {
          $set: {
            'cartItems.$.quantity': quantity,
          },
        },
        { new: true },
      );
    }

    if (!cart) {
      throw new NotFoundException('item not found');
    }

    const totalPrice = cart.cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    const discount = cart.coupon?.discount || 0;
    const discountAmount = (totalPrice * discount) / 100;

    cart.totalPrice = totalPrice;
    cart.totalPriceAfterDiscount = Math.max(0, totalPrice - discountAmount);

    await cart.save();
    await cart.populate({ path: 'cartItems.productId', select: 'title color' });

    return {
      status: 'success',
      message: 'Cart updated successfully',
      data: cart,
    };
  }

  async removeItemFromCart(itemId: string, userId: string) {
    const cart = await this.cartModel.findOneAndUpdate(
      {
        userId,
        'cartItems.productId': itemId,
      },
      {
        $pull: {
          cartItems: {
            productId: itemId,
          },
        },
      },
      {
        new: true,
      },
    );

    if (!cart) {
      throw new NotFoundException('Product not found');
    }

    const totalPrice = cart.cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    const discount = cart.coupon?.discount || 0;
    const discountAmount = (totalPrice * discount) / 100;

    cart.totalPrice = totalPrice;
    cart.totalPriceAfterDiscount = Math.max(0, totalPrice - discountAmount);

    await cart.save();

    return {
      status: 'success',
      message: 'Item removed successfully',
      data: cart,
    };
  }
}

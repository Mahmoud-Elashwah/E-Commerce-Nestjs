import * as common from '@nestjs/common';
import { OrderService } from './order.service';
import { AcceptOrderCashDto, CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { Roles } from 'src/user/decorators/roles.decorator';
import { Request } from 'express';

@common.Controller('v1/cart/checkout')
export class OrderCheckoutController {
  constructor(private readonly orderService: OrderService) {}

  //  @docs   User Can Create Order and Checkout session
  //  @Route  POST /api/v1/cart/checkout/:paymentMethodType?success_url=https://ecommerce-nestjs.com&cancel_url=https://ecommerce-nestjs.com
  //  @access Private [User]
  @common.Post(':paymentMethodType')
  @Roles(['user'])
  @common.UseGuards(AuthGuard)
  create(
    @common.Param('paymentMethodType') paymentMethodType: 'card' | 'cash',
    @common.Body(
      new common.ValidationPipe({
        forbidNonWhitelisted: true,
        whitelist: true,
      }),
    )
    createOrderDto: CreateOrderDto,
    @common.Req() req,
    @common.Query() query,
  ) {
    if (req.user.role.toLowerCase() === 'admin') {
      throw new common.UnauthorizedException();
    }
    if (!['card', 'cash'].includes(paymentMethodType)) {
      throw new common.NotFoundException('No payment method found');
    }
    const {
      success_url = 'https://ecommerce-nestjs.com',
      cancel_url = 'https://ecommerce-nestjs.com',
    } = query;

    const dataAfterPayment = {
      success_url,
      cancel_url,
    };

    const user_id = req.user._id;
    return this.orderService.create(
      user_id,
      paymentMethodType,
      createOrderDto,
      dataAfterPayment,
    );
  }

  //  @docs   Admin Can Update Order payment cash
  //  @Route  PATCH /api/v1/cart/checkout/:orderId/cash
  //  @access Private [User]
  @common.Patch(':orderId/cash')
  @Roles(['admin'])
  @common.UseGuards(AuthGuard)
  updatePaidCash(
    @common.Param('orderId') orderId: string,
    @common.Body(
      new common.ValidationPipe({
        forbidNonWhitelisted: true,
        whitelist: true,
      }),
    )
    updateOrderDto: AcceptOrderCashDto,
  ) {
    return this.orderService.updatePaidCash(orderId, updateOrderDto);
  }
}

@common.Controller('v1/checkout/session')
export class CheckoutCardController {
  constructor(private readonly orderService: OrderService) {}

  //  @docs   Webhook paid order true auto
  //  @Route  PATCH /api/v1/checkout/session
  //  @access Private [Stripe]
  @common.Post()
  updatePaidCard(
    @common.Headers('stripe-signature') sig,
    @common.Req() request: common.RawBodyRequest<Request>,
  ) {
    const endpointSecret =
      'whsec_db59966519a65529ae568ade70303bf419be37a47f3777c18a8a4f1c79c8a07a';

    const payload = request.rawBody;

    return this.orderService.updatePaidCard(payload, sig, endpointSecret);
  }
}

@common.Controller('v1/order/user')
export class OrderForUserController {
  constructor(private readonly orderService: OrderService) {}

  //  @docs   User Can get all order
  //  @Route  GET /api/v1/order/user
  //  @access Private [User]
  @common.Get()
  @Roles(['user'])
  @common.UseGuards(AuthGuard)
  findAllOrdersOnUser(@common.Req() req) {
    if (req.user.role.toLowerCase() === 'admin') {
      throw new common.UnauthorizedException();
    }
    const user_id = req.user._id;
    return this.orderService.findAllOrdersOnUser(user_id);
  }
}
@common.Controller('v1/order/admin')
export class OrderForAdminController {
  constructor(private readonly orderService: OrderService) {}

  //  @docs   Admin Can get all order
  //  @Route  GET /api/v1/order/admin
  //  @access Private [Admin]
  @common.Get()
  @Roles(['admin'])
  @common.UseGuards(AuthGuard)
  findAllOrders() {
    return this.orderService.findAllOrders();
  }
  //  @docs   Admin Can get all order
  //  @Route  GET /api/v1/order/admin/:userId
  //  @access Private [Admin]
  @common.Get(':userId')
  @Roles(['admin'])
  @common.UseGuards(AuthGuard)
  findAllOrdersByUserId(@common.Param('userId') userId: string) {
    return this.orderService.findAllOrdersOnUser(userId);
  }
}

/*
stripe login
stripe listen --forward-to localhost:3000/api/v1/checkout/session
*/

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { Roles } from 'src/user/decorators/roles.decorator';
import type { Request } from 'express';
import type { RawBodyRequest } from '@nestjs/common';

import Stripe from 'stripe';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // create order for user
  @Post()
  @UseGuards(AuthGuard)
  @Roles(['user'])
  create(@Body() createOrderDto: CreateOrderDto, @Req() req) {
    return this.orderService.create(createOrderDto, req.user._id);
  }

  @Get()
  @UseGuards(AuthGuard)
  @Roles(['admin', 'user'])
  findAll(@Query() query, @Req() req) {
    return this.orderService.findAll(query, req.user);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @Roles(['admin', 'user'])
  findOne(@Param('id') id: string, @Req() req) {
    return this.orderService.findOne(id, req.user);
  }

  // only admin can update order's isPaid ,isDelivered
  @Patch(':orderId')
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  update(@Param('orderId') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}

@Controller('webhook')
export class webhookController {
  private stripe: Stripe;
  constructor(private readonly orderService: OrderService) {
    const secret = process.env.STRIPE_SECRET_KEY;

    if (!secret) {
      throw new Error('ST_SECRET is not defined');
    }

    this.stripe = new Stripe(secret, {});
  }

  // webhook with(Stripe)
  @Post('stripe')
  handleStripeWebhook(@Req() request: RawBodyRequest<Request>) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!endpointSecret) {
      throw new Error('ST_SECRET is not defined');
    }
    const sig = request.headers['stripe-signature'] as string;

    const rawBody = request.rawBody;

    if (!rawBody) {
      // ✅ guard against undefined
      throw new BadRequestException('Missing raw body');
    }

    return this.orderService.handleWebhook(rawBody, sig, endpointSecret);
  }
}

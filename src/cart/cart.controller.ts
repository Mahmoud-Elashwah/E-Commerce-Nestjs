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
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { Roles } from 'src/user/decorators/roles.decorator';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles(['user'])
  addToCart(@Body() createCartDto: CreateCartDto, @Req() req) {
    return this.cartService.addToCart(createCartDto, req.user._id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @Roles(['user', 'admin'])
  findOne(@Param('id') id: string, @Req() req) {
    return this.cartService.findOne(id, req.user);
  }

  @Patch(':productId')
  @UseGuards(AuthGuard)
  @Roles(['user'])
  update(
    @Param('productId') productId: string,
    @Body() updateCartDto: UpdateCartDto,
    @Req() req,
  ) {
    return this.cartService.update(productId, updateCartDto, req.user._id);
  }

  @Delete(':itemId')
  @UseGuards(AuthGuard)
  @Roles(['user'])
  remove(@Param('itemId') itemId: string, @Req() req) {
    return this.cartService.removeItemFromCart(itemId, req.user._id);
  }
}

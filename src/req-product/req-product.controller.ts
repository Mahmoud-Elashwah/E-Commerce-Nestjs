import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  Req,
} from '@nestjs/common';
import { ReqProductService } from './req-product.service';
import { CreateReqProductDto } from './dto/create-req-product.dto';
import { UpdateReqProductDto } from './dto/update-req-product.dto';
import { Roles } from 'src/user/decorators/roles.decorator';
import { AuthGuard } from 'src/user/guard/auth.guard';

@Controller('req-product')
export class ReqProductController {
  constructor(private readonly reqProductService: ReqProductService) {}

  @Post()
  @Roles(['user'])
  @UseGuards(AuthGuard)
  create(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true }))
    createReqProductDto: CreateReqProductDto,
    @Req() req,
  ) {
    return this.reqProductService.create(createReqProductDto, req.user._id);
  }

  @Get()
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  findAll() {
    return this.reqProductService.findAll();
  }

  @Get(':id')
  @Roles(['admin', 'user'])
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string, @Req() req) {
    return this.reqProductService.findOne(id, req.user);
  }

  @Patch(':id')
  @Roles(['user'])
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true }))
    updateReqProductDto: UpdateReqProductDto,
    @Req() req,
  ) {
    return this.reqProductService.update(id, updateReqProductDto, req.user);
  }

  @Delete(':id')
  @Roles(['user'])
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @Req() req) {
    return this.reqProductService.remove(id, req.user);
  }
}

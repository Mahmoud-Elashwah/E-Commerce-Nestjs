import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { Roles } from 'src/user/decorators/roles.decorator';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles(['user'])
  create(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true }))
    createReviewDto: CreateReviewDto,
    @Req() req,
  ) {
    return this.reviewService.create(createReviewDto, req.user._id);
  }

  @Get(':productId/product')
  findAll(@Param('productId') productId: string, @Query() query) {
    return this.reviewService.findAll(productId, query);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @Roles(['admin', 'user'])
  findAllForOneUser(@Param('id') id: string, @Req() req) {
    return this.reviewService.findAllForOneUser(id, req.user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @Roles(['user'])
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true }))
    updateReviewDto: UpdateReviewDto,
    @Req() req,
  ) {
    return this.reviewService.update(id, updateReviewDto, req.user._id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles(['user'])
  remove(@Param('id') id: string, @Req() req) {
    return this.reviewService.remove(id, req.user._id);
  }
}

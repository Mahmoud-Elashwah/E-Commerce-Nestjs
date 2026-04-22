import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review } from './review.schema';
import { ApiFeatures } from 'src/utils/api-features.utils';

@Injectable()
export class ReviewService {
  constructor(@InjectModel('Review') private reviewModel: Model<Review>) {}

  async create(createReviewDto: CreateReviewDto, userId: string) {
    const existingReview = await this.reviewModel.findOne({
      user: userId as any,
      product: createReviewDto.product as any,
    });

    if (existingReview) {
      throw new ForbiddenException('You already reviewed this product');
    }
    const createdReview = await this.reviewModel.create({
      ...createReviewDto,
      product: createReviewDto.product as any,
      user: userId as any,
    });
    return {
      status: 'success',
      message: 'Review created successfully',
      data: createdReview,
    };
  }

  async findAll(productId: string, query: any) {
    const feature = new ApiFeatures<Review>(
      this.reviewModel.find({ product: productId as any }),
      query,
    );

    const reviews = await feature.query.populate('user', 'name email');

    return {
      status: 'success',
      results: reviews.length,
      data: reviews,
    };
  }

  async findAllForOneUser(id: string, user: { _id: string; role: string }) {
    if (user.role !== 'admin' && user._id.toString() !== id.toString()) {
      throw new ForbiddenException('You can only view your own reviews');
    }

    const reviews = await this.reviewModel
      .find({ user: id as any })
      .populate('product', 'title category');

    return {
      status: 'success',
      results: reviews.length,
      data: reviews,
    };
  }

  async update(id: string, updateReviewDto: UpdateReviewDto, userId: string) {
    const review = await this.reviewModel.findById(id);
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    if (review.user.toString() !== userId.toString()) {
      throw new ForbiddenException('You can only update your own review');
    }
    const updatedReview = await this.reviewModel.findByIdAndUpdate(
      id,
      {
        reviewText: updateReviewDto.reviewText,
        rating: updateReviewDto.rating,
      },
      { new: true },
    );
    return {
      status: 'success',
      message: 'Review updated successfully',
      data: updatedReview,
    };
  }

  async remove(id: string, userId: string) {
    const review = await this.reviewModel.findById(id);
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    if (review.user.toString() !== userId.toString()) {
      throw new ForbiddenException('You can only delete your own review');
    }
    await this.reviewModel.findByIdAndDelete(id);
    return {
      status: 'success',
      message: 'Review deleted successfully',
    };
  }
}

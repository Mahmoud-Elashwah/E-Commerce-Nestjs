import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Model } from 'mongoose';

export type ReviewDocument = HydratedDocument<Review>;

export interface ReviewModel extends Model<Review> {
  calcAverageRating(productId: string): Promise<void>;
}

@Schema({ timestamps: true })
export class Review {
  @Prop({
    type: String,
  })
  reviewText?: string;

  @Prop({
    type: Number,
    required: true,
    min: 1,
    max: 5,
  })
  rating: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  })
  product: mongoose.Schema.Types.ObjectId;
}

export const reviewSchema = SchemaFactory.createForClass(Review);

reviewSchema.index({ user: 1, product: 1 }, { unique: true });

reviewSchema.statics.calcAverageRating = async function (productId: string) {
  const status = await this.aggregate([
    {
      $match: {
        product: new mongoose.Types.ObjectId(productId),
      },
    },
    {
      $group: {
        _id: '$product',
        ratingAverage: { $avg: '$rating' },
        ratingQuantity: { $sum: 1 },
      },
    },
  ]);

  const ProductModel = this.db.model('Product');

  if (status.length > 0) {
    await ProductModel.findByIdAndUpdate(productId, {
      ratingAverage: status[0].ratingAverage,
      ratingQuantity: status[0].ratingQuantity,
    });
  } else {
    await ProductModel.findByIdAndUpdate(productId, {
      ratingAverage: 0,
      ratingQuantity: 0,
    });
  }
};

reviewSchema.post('save', async function () {
  const model = this.constructor as ReviewModel;
  await model.calcAverageRating(this.product.toString());
});

reviewSchema.post(/^findOneAnd/, async function (doc) {
  if (doc) {
    const model = doc.constructor as ReviewModel;
    await model.calcAverageRating(doc.product.toString());
  }
});

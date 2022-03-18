import mongoose, { Schema } from 'mongoose';
import TourModel from './TourModel';
import UserModel from './UserModel';

const ReviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'A message is necessary to leave the review!'],
    },
    rating: {
      type: Number,
      required: true,
      max: [5.0, 'The maximum amount for ratings is 5.0'],
      min: [1.0, 'The minimum amount for ratings is 1.0'],
    },
    createdAt: {
      type: Date,
      immutable: true,
      default: Date.now,
    },
    tour: {
      type: Schema.Types.ObjectId,
      ref: TourModel,
      required: [true, 'Reviews must belong to a tour.'],
      immutable: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: UserModel,
      required: [true, 'Reviews must belong to a user.'],
      immutable: true,
    },
    __v: {
      type: Number,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ReviewSchema.statics.calcAverageRatings = async function (tourId: string) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRatings: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  await TourModel.findByIdAndUpdate(tourId, {
    ratingQuantity: stats?.[0]?.nRatings ?? 0,
    ratingAverage: stats?.[0]?.avgRating ?? 4.5,
  });
};

ReviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.tour);
});

ReviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne().clone();
  next();
});

ReviewSchema.post(/^findOneAnd/, function () {
  this.r.constructor.calcAverageRatings(this.r.tour);
});

const ReviewModel = mongoose.model('Review', ReviewSchema, 'reviews');

export default ReviewModel;

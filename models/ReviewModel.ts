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

export default mongoose.model('Review', ReviewSchema, 'reviews');

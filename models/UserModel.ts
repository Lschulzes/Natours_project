import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { UserRoles } from '../resources/helpers';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
    unique: true,
    trim: true,
    maxlength: [25, 'A user name must have less or equal than 25 characters'],
    minlength: [5, 'A user name must have less or equal than 5 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please tell us your Email'],
    lowercase: true,
    unique: true,
    trim: true,
    maxlength: [50, 'A email must have less or equal than 50 characters'],
    minlength: [5, 'A email must have less or equal than 5 characters'],
    validate: [validator.isEmail, 'Please provide a valid Email'],
  },
  photo: String,
  role: {
    type: String,
    enum: [UserRoles],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    maxlength: [30, 'A password must have less or equal than 30 characters'],
    minlength: [10, 'A password must have less or equal than 10 characters'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please provide a password confirmation'],
  },
  passwordChangedAt: Date,
});

UserSchema.path('password').validate(function (_val: any) {
  // @ts-ignore
  const thisTyped: any = this as any;
  if (thisTyped.password !== thisTyped.passwordConfirm) {
    thisTyped.invalidate('passwordConfirm', 'passwords must match');
    return;
  }
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

UserSchema.methods.isPasswordCorrect = async function (
  incomingPassword: string,
  userPassword: string
) {
  return await bcrypt.compare(incomingPassword, userPassword);
};

UserSchema.methods.changedPasswordAfter = function (JWTTimestamp: number) {
  if (this.passwordChangedAt) {
    const changedTimestamp = this.passwordChangedAt.getTime() / 1000;
    return changedTimestamp > JWTTimestamp;
  }
  return false;
};

export default mongoose.model('User', UserSchema, 'users');

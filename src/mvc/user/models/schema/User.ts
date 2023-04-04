/* eslint-disable @typescript-eslint/no-this-alias */
import {
  booleanValidation,
  mongoIdValidation,
  passwordValidation,
  textValidationNullable,
  textValidationRequired,
} from '@/helpers/libs/schemaValidations';
import mongoose, { Schema } from 'mongoose';
import { IUser, IUserModel } from '../interface/IUser';
import * as argon from 'argon2';

const User = new Schema<IUser>({
  name: textValidationRequired(),
  username: textValidationRequired(),
  email: {
    type: String,
    lowercase: true,
    trim: true,
    unique: true,
    sparse: true,
  },
  isEmailVerified: booleanValidation(false),
  password: passwordValidation(),
  confirmPassword: textValidationNullable(),
  role: mongoIdValidation('Role'),
});

User.static('isEmailTaken', async function (email: string, excludeUserId: mongoose.ObjectId): Promise<boolean> {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
});

User.pre<IUser>('save', async function (next) {
  const user = this;
  // Check if password or confirmPassword is modified before saving
  if (!user.isModified('password') && !user.isModified('confirmPassword')) {
    return next();
  }

  const saltLength = 12;
  // Hash password before saving
  const hashedPassword = await argon.hash(user.password, { saltLength });
  user.password = hashedPassword;
  user.confirmPassword = undefined;
  next();
});
User.pre<IUser>('update', async function (next) {
  const user = this;
  // Check if password or confirmPassword is modified before saving
  if (!user.isModified('password') && !user.isModified('confirmPassword')) {
    return next();
  }

  const saltLength = 12;
  // Hash password before saving
  const hashedPassword = await argon.hash(user.password, { saltLength });
  user.password = hashedPassword;
  user.confirmPassword = undefined;
  next();
});

User.set('toObject', { getters: true, virtuals: true });
User.set('toJSON', { getters: true, virtuals: true });
export default mongoose.model<IUser, IUserModel>('User', User);

import { userCollectionName } from '@/helpers/libs/collectionNames';
import { booleanValidation, passwordValidation, textValidationNullable, textValidationRequired } from '@/helpers/libs/schemaValidations';
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
  role: textValidationNullable(),
});

User.static('isEmailTaken', async function (email: string, excludeUserId: mongoose.ObjectId): Promise<boolean> {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
});
User.static('isPasswordMatch', async function (hash: string, password: string): Promise<boolean> {
  const user = await argon.verify(hash, password);
  return !!user;
});

User.set('toObject', { getters: true, virtuals: true });
User.set('toJSON', { getters: true, virtuals: true });
export default mongoose.model<IUser, IUserModel>('User', User, userCollectionName);

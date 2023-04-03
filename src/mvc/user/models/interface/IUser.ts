import { BaseModel } from '@/helpers/libs/BaseModel';
import mongoose, { Model } from 'mongoose';

export interface IUser extends BaseModel {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  isEmailVerified: boolean;
}
export interface IUserDoc extends IUser {
  isPasswordMatch(hash: string, password: string): Promise<boolean>;
}
export interface IUserModel extends Model<IUserDoc> {
  isEmailTaken(email: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean>;
}
export type ILogin = Pick<IUser, 'email' | 'password'>;

export type NewRegisterUser = Omit<IUser, 'role' | 'isEmailVerified'>;

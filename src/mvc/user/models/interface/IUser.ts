import { BaseModel } from '@/helpers/libs/BaseModel';
import { IRole } from '@/mvc/role/models/interface/IRole';
import mongoose, { Model } from 'mongoose';

export interface IUser extends BaseModel {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: IRole['_id'];
  isEmailVerified: boolean;
}
export interface IUserDoc extends IUser {
  isPasswordMatch(hash: string, password: string): Promise<boolean>;
}
export type UpdateUserBody = Partial<IUser>;
export interface IUserModel extends Model<IUserDoc> {
  isEmailTaken(email: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean>;
}
export type ILogin = Pick<IUser, 'email' | 'password'>;

export type NewRegisterUser = Omit<IUser, 'isEmailVerified'>;
export type NewRegisterUserTest = Omit<IUser, 'isEmailVerified' | 'role' | 'confirmPassword'>;

export interface NewRegisterUserTest1 {
  name: string;
  username: string;
  email: string;
  password: string;
}

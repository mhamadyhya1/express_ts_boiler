import config from '@/config/config';
import { getIDfromToken } from '@/helpers/getIDfromToken';
import { saveQuery } from '@/helpers/libs/globals/queryHelpers';
import Token from '@/mvc/token/models/schema/Token';
import tokenTypes from '@/mvc/token/models/types/token.types';
import * as argon2 from 'argon2';
import { ILogin, IUserDoc, NewRegisterUser, UpdateUserBody } from '../models/interface/IUser';
import User from '../models/schema/User';
import AppError from '@/middlewares/error/AppError';

export async function registerUser(data: NewRegisterUser): Promise<{}> {
  if (await User.isEmailTaken(data.email)) {
    throw new AppError(400,"Email Already Exists")
  }
  const request = await saveQuery(new User(data));
  return request;
}

export const getUserById = async (id: IUserDoc['_id']): Promise<IUserDoc | null> => User.findById(id);
export const getUserByEmail = async (email: string): Promise<IUserDoc | null> => User.findOne({ email }, { email: 1, username: 1, password: 1 });
export async function loginUserWithEmailAndPass(data: ILogin): Promise<{}> {
  const user = await this.getUserByEmail(data.email);
  if (!user || (await argon2.verify(user.password, data.password)) === false) {
    throw new Error('Incorrect email or password');
  }
  return user;
}
export const loginUserWithEmailAndPassword = async (data: ILogin): Promise<IUserDoc> => {
  const user = await getUserByEmail(data.email);
  if (!user || !(await argon2.verify(user.password, data.password))) {
    throw new Error('Incorrect email or password');
  }
  return user;
};
export const logout = async (refreshToken: string): Promise<void> => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: config.jwt.secret.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new Error('Not found');
  }
  await refreshTokenDoc.deleteOne();
};
export const updateUserById = async (userId: IUserDoc['_id'], updateBody: UpdateUserBody): Promise<IUserDoc | null> => {
  const user = getUserById(userId);
  if (!user) {
    throw new Error( 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new Error('Email already taken');
  }
  Object.assign(user, updateBody);
  await (await user).save();
  return user;
};
export const resetPassword = async (resetPasswordToken: string, newPassword: string) => {
  try {
    const resetPasswordDocID = await getIDfromToken(resetPasswordToken, config.jwt.secret.ACCESS);
    const user = await User.findById(resetPasswordDocID);
    if (!user) {
      throw new Error();
    }
    await updateUserById(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET });
  } catch (error) {
    throw new Error('Password reset failed');
  }
};

import config from '@/config/config';
import { IUserDoc } from '@/mvc/user/models/interface/IUser';
import userServices from '@/mvc/user/services';
import jwt from 'jsonwebtoken';
import moment, { Moment } from 'moment';
import mongoose from 'mongoose';
import { ITokenDoc } from '../models/interface/IToken';
import Token from '../models/schema/Token';
import tokenTypes from '../models/types/token.types';
import AppError from '@/middlewares/error/AppError';

const generateToken = (userId: mongoose.Types.ObjectId, expires: Moment, secret: string): string => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
  };
  return jwt.sign(payload, secret);
};

export const saveToken = async (token: string, userId: mongoose.Types.ObjectId, expires: Moment, type: string): Promise<ITokenDoc> => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type,
  });
  return tokenDoc;
};
export const generateAuthTokens = async (user: IUserDoc): Promise<{}> => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(user.id, accessTokenExpires, config.jwt.secret.ACCESS);

  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  const refreshToken = generateToken(user.id, refreshTokenExpires, config.jwt.secret.REFRESH);
  await saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH);

  return {
    access: {
      token: accessToken,
    },
    refresh: {
      token: refreshToken,
    },
  };
};
export const verifyToken = async (token: string, type: string): Promise<{}> => {
  const payload = jwt.verify(token, config.jwt.secret);
  if (typeof payload.sub !== 'string') {
    throw new AppError(401,"Token Not Verified")
  }
  const tokenDoc = await Token.findOne({
    token,
    type,
    user: payload.sub,
  });
  if (!tokenDoc) {
    throw new AppError(401,'Token not found');
  }
  return tokenDoc;
};
export const generateResetPasswordToken = async (email: string): Promise<string> => {
  const user = await userServices.getUserByEmail(email);
  if (!user) {
    throw new AppError(401,"User not Available")
  }
  const expires = moment().add(config.resetPassword.resetTokenExpTime, 'minutes');
  const resetPasswordToken = generateToken(user.id, expires, config.resetPassword.resetPasswordSec);
  await saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET);
  return resetPasswordToken;
};

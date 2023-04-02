import config from '@/config/config';
import { saveQuery } from '@/helpers/libs/globals/queryHelpers';
import { IUserDoc } from '@/mvc/user/models/interface/IUser';
import jwt from 'jsonwebtoken';
import moment, { Moment } from 'moment';
import mongoose from 'mongoose';
import { ITokenDoc } from '../models/interface/IToken';
import Token from '../models/schema/Token';
import tokenTypes from '../models/types/token.types';

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

import moment, { Moment } from 'moment';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
export const generateToken = (userId: mongoose.Types.ObjectId, expires: Moment, type: string, secret: string): string => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

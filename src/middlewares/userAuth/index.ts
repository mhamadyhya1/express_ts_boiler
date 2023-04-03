import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import config from '@/config/config';
import catchAsync from '@/helpers/utils/catchAsync';
import Token from '@/mvc/token/models/schema/Token';
import User from '@/mvc/user/models/schema/User';

export const verifyToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new Error('Authorization header is missing or invalid');
  }

  const token = authHeader.split(' ')[1];
  const payload = jwt.verify(token, config.jwt.secret.ACCESS) as { sub: string };

  if (typeof payload.sub !== 'string') {
    throw new Error('Invalid token payload');
  }

  const tokenDoc = await Token.findOne({ user: payload.sub });
  if (!tokenDoc) {
    throw new Error('User does not belong to this token');
  }

  const currentUser = await User.findById(payload.sub);
  if (!currentUser) {
    throw new Error('User that belong to this token does not exist');
  }

  return next();
});

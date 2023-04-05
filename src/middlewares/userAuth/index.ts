import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import config from '@/config/config';
import catchAsync from '@/helpers/utils/catchAsync';
import Token from '@/mvc/token/models/schema/Token';
import User from '@/mvc/user/models/schema/User';
import AppError from '../error/AppError';
import httpStatus from 'http-status';

export const verifyToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new AppError(httpStatus.UNAUTHORIZED,'Authorization header is missing or invalid');
  }

  const token = authHeader.split(' ')[1];
  const payload = jwt.verify(token, config.jwt.secret.ACCESS) as { sub: string };
  const roleCheck = await User.findById(payload.sub).populate({ path: 'role', select: 'name' });
  const roleName = roleCheck.role.name;
  if (roleName !== 'admin') {
    throw new AppError(httpStatus.UNAUTHORIZED,'Cannot Access');
  }
  if (typeof payload.sub !== 'string') {
    throw new AppError(httpStatus.UNAUTHORIZED,'Invalid token payload');
  }

  const tokenDoc = await Token.findOne({ user: payload.sub });
  if (!tokenDoc) {
    throw new AppError(400,'User does not belong to this token');
  }

  const currentUser = await User.findById(payload.sub);
  if (!currentUser) {
    throw new AppError(400,'User that belong to this token does not exist');
  }

  return next();
});

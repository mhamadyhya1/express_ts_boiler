import catchAsync from '@/helpers/utils/catchAsync';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { NewRegisterUser } from '../models/interface/IUser';
import userServices from '../services';
import { ILogin } from '../models/interface/IUser';
import { tokenServices } from '@/mvc/token/services';
export const registerUser = catchAsync(async (req: Request, res: Response) => {
  const data: NewRegisterUser = req.body;
  const user = await userServices.registerUser(data);
  res.status(httpStatus.CREATED).json(user);
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const data: ILogin = req.body;
  const user = await userServices.loginUserWithEmailAndPassword(data);
  const tokens = await tokenServices.generateAuthTokens(user);
  res.send({ user, tokens });
});

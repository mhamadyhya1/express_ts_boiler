import catchAsync from '@/helpers/utils/catchAsync';
import { IToken } from '@/mvc/token/models/interface/IToken';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { ICreateRole } from '../models/interface/IRole';
import roleService from '../services';
export const createRole = catchAsync(async (req: Request, res: Response) => {
  const data: ICreateRole = req.body;
  const user = await roleService.createRole(data);
  res.status(httpStatus.CREATED).json(user);
});
export const checkRole = catchAsync(async (req: Request, res: Response) => {
  const data: IToken = req.body;
  const user = await roleService.checkRole(data);
  res.status(httpStatus.CREATED).json(user);
});

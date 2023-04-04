import catchAsync from '@/helpers/utils/catchAsync';
import { Request, Response } from 'express';
import { ICreateTest } from '../interface/model/ITest';
import testService from '../services';

export const createTest = catchAsync(async (req: Request, res: Response) => {
  const data: ICreateTest = req.body;
  const test = await testService.createTest(data);
  res.status(201).json(test);
});

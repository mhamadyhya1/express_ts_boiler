import { BaseModel } from '@/helpers/libs/BaseModel';

export interface ITest extends BaseModel {
  name: string;
  question: string;
}

export type ICreateTest = Pick<ITest, 'name' | 'question'>;

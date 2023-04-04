import { BaseModel } from '@/helpers/libs/BaseModel';

export interface IRole extends BaseModel {
  name: String;
  status: Number;
}
export type ICreateRole = Omit<IRole, 'status'>;

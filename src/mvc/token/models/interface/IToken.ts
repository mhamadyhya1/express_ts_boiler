import { BaseModel } from '@/helpers/libs/BaseModel';
import { IUser } from '@/mvc/user/models/interface/IUser';

export interface IToken extends BaseModel {
  token: string;
  user: IUser['_id'];
  type: string;
  expires: Date;
}

export type ITokenDoc = IToken;

import { BaseModel } from '@/helpers/libs/BaseModel';
import { IUser } from '@/mvc/user/models/interface/IUser';

export interface IToken extends BaseModel {
  token: String;
  user: IUser['_id'];
  type: String;
  expires: Date;
}

export interface ITokenDoc extends IToken {
  sub?: String;
}
export type ITokenSub = Omit<ITokenDoc, 'sub'>;

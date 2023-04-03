import { saveQuery } from '@/helpers/libs/globals/queryHelpers';
import { IToken } from '@/mvc/token/models/interface/IToken';
import User from '@/mvc/user/models/schema/User';
import { ICreateRole } from '../models/interface/IRole';
import Role from '../models/schema/Role';

export async function createRole(data: ICreateRole): Promise<{}> {
  const req = await saveQuery(new Role(data));
  return req;
}
export async function checkRole(data: IToken): Promise<{}> {
  const req = await User.findById(data.user).populate({ path: 'role', select: 'name' });
  return req.role.name;
}

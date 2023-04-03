import { saveQuery } from '@/helpers/libs/globals/queryHelpers';
import { ICreateRole } from '../models/interface/IRole';
import Role from '../models/schema/Role';

export async function createRole(data: ICreateRole): Promise<{}> {
  const exists = await Role.find({ name: data.name });
  if (exists) {
    throw new Error('Role already exists');
  }
  const req = await saveQuery(new Role(data));
  return req;
}

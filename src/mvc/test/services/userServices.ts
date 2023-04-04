import { saveQuery } from '@/helpers/libs/globals/queryHelpers';
import { ICreateTest } from '../interface/model/ITest';
import Test from '../interface/schema/Test';

class TestServices {
  async createTest(data: ICreateTest): Promise<{}> {
    const req = await saveQuery(new Test(data));
    return req;
  }
}
export default TestServices;

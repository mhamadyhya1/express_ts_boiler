import Joi from 'joi';
import { ICreateTest } from '../interface/model/ITest';
class TestValidation {
  createTestBody: Record<keyof ICreateTest, any> = {
    name: Joi.string().required(),
    question: Joi.string().required(),
  };
  createTest = {
    body: Joi.object().keys(this.createTestBody),
  };
}
export default TestValidation;

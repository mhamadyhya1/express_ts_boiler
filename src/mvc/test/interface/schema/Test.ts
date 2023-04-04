import { textValidation, textValidationNullable } from '@/helpers/libs/schemaValidations';
import mongoose, { Schema } from 'mongoose';
import { ITest } from '../model/ITest';

const Test = new Schema<ITest>(
  {
    name: textValidationNullable(),
    question: textValidation(),
  },
  {
    timestamps: false,
  },
);
const User = mongoose.model<ITest>('Test', Test);

export default User;

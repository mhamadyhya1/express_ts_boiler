import { numberValidation, textValidationNullable } from '@/helpers/libs/schemaValidations';
import mongoose, { Schema } from 'mongoose';
import { IRole } from '../interface/IRole';

const Role = new Schema<IRole>(
  {
    name: textValidationNullable(),
    status: numberValidation(1),
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

Role.set('toObject', { getters: true, virtuals: true });
Role.set('toJSON', { getters: true, virtuals: true });
export default mongoose.model<IRole>('Role', Role);

import { userCollectionName } from '@/helpers/libs/collectionNames';
import { mongoIdValidation, textValidationIndexRequired } from '@/helpers/libs/schemaValidations';
import mongoose, { Schema } from 'mongoose';
import { IToken } from '../interface/IToken';

const Token = new Schema<IToken>({
  token: textValidationIndexRequired(),
  user: mongoIdValidation(`${userCollectionName}`),
});

Token.set('toObject', { getters: true, virtuals: true });
Token.set('toJSON', { getters: true, virtuals: true });
export default mongoose.model<IToken>('Token', Token, userCollectionName);

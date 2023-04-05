import mongoose, { Schema } from "mongoose";
import { IPost } from "../interface/IPost";
import { dateValidationRequired, mongoIdValidation, textValidationNullable, textValidationNullableRequired } from "@/helpers/libs/schemaValidations";
import { postCollectionName, userCollectionName } from "@/helpers/libs/collectionNames";
import User from "@/mvc/user/models/schema/User";

const Post = new Schema<IPost>({
    title: textValidationNullableRequired(),
    description: textValidationNullable(),
    createdAt: dateValidationRequired(),
    user:mongoIdValidation(`${userCollectionName}`)
},
    {
        versionKey: false,
        timestamps: true,
    },
);
Post.path('user').validate(async (value)=>{
    return User.findById(value)
},'User does not exists')
Post.set('toObject', { getters: true, virtuals: true });
Post.set('toJSON', { getters: true, virtuals: true });
export default mongoose.model<IPost>('Post', Post, postCollectionName);
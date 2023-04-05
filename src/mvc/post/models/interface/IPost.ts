import { BaseModel } from "@/helpers/libs/BaseModel"
import { IUser } from "@/mvc/user/models/interface/IUser"

export interface IPost extends BaseModel{
    title:String,
    user:IUser['_id'],
    description:String
    createdAt: Date
}
export type IGetPosts =Pick<IPost,'user'>
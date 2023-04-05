import { getOneQuery, saveQuery } from "@/helpers/libs/globals/queryHelpers";
import { IGetPosts, IPost } from "../models/interface/IPost";
import Post from "../models/schema/Post";
import AppError from "@/middlewares/error/AppError";
import httpStatus from "http-status";

export async function createPost(data:IPost):Promise<{}>{
    try{
        data.createdAt=new Date()
        const request = await saveQuery(new Post(data))
        return request
    }
    catch(error){
        throw new AppError(httpStatus.BAD_REQUEST,error.toString())
    }
}
export async function getPostsByUser(data:IGetPosts):Promise<IGetPosts>{
    try{
        const req = await getOneQuery(Post.find({user:data.user}))
    return req
    }
    catch(error){
        throw new AppError(httpStatus.BAD_REQUEST,error.toString())
    }
}
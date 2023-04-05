import catchAsync from "@/helpers/utils/catchAsync";
import { Request, Response } from "express";
import postServices from "../services";
import { IGetPosts, IPost } from "../models/interface/IPost";
import httpStatus from "http-status";

export const createPost = catchAsync(async (req: Request, res: Response) => {
    const data:IPost=req.body;
    const request = await postServices.createPost(data)
    return res.status(httpStatus.OK).send(request)
});
export const getPostByUser = catchAsync(async (req: Request, res: Response) => {
    const id:IGetPosts['user']=req.params.id
    const request = await postServices.getPostsByUser(id)
    return res.status(httpStatus.OK).send(request)
});
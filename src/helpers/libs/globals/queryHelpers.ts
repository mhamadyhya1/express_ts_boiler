import {FilterQuery, Model, Query} from "mongoose";
import {limitNumber} from "@libs/globals/globalVariables";
import {BaseModel} from "@libs/BaseModel";
import {Context} from "aws-lambda";
import {connectToMongoose} from "../../database/mongoose_connect";
import * as Mongoose from "mongoose";
import ErrorHandling from "@libs/globals/errorHandling";

export const getObjectId = (id: string) => new Mongoose.Types.ObjectId(id)

export const getAllQuery = async (context: Context, query: Query<any, any>, page?: number, populate?: any) => {
    try {
        /// 1. by mongoose
        await connectToMongoose(context);

        let skip = 0;
        if (page > 1) {
            skip = (page - 1) * limitNumber;
        }

        if (populate != undefined) {
            return query
                .populate(populate)
                .skip(skip).limit(limitNumber)
                .sort({$natural: -1})
                .lean({virtuals: true})
                .exec()
        } else return query
            .skip((page - 1) * limitNumber).limit(limitNumber)
            .sort({$natural: -1})
            .lean({virtuals: true})
            .exec()
    } catch (e) {
        throw new ErrorHandling().getErrorMessage(e);
    }
}

export const getOneQuery = async (context: Context, query: Query<any, any>, populate?: any) => {
    try {
        /// 1. by mongoose
        await connectToMongoose(context);

        if (populate != undefined) {
            return query
                .populate(populate)
                .lean().exec()
        } else return query.lean().exec()
    } catch (e) {
        throw new ErrorHandling().getErrorMessage(e);
    }
}
export const getOneQueryAggregate = async (context: Context, query: FilterQuery<any>, populate?: any) => {
    try {
        /// 1. by mongoose
        await connectToMongoose(context);

        if (populate != undefined) {
            return query
                .populate(populate)
                .lean().exec()
        } else return query.lean().exec()
    } catch (e) {
        throw new ErrorHandling().getErrorMessage(e);
    }
}


export const executeQuery = async (context: Context, query: Query<any, any>) => {
    try {
        /// 1. by mongoose
        await connectToMongoose(context);

        return query.lean().exec()
    } catch (e) {
        throw new ErrorHandling().getErrorMessage(e);
    }
}

export const saveQuery = async (context: Context, model: BaseModel) => {
    try {
        /// 1. by mongoose
        await connectToMongoose(context);

        return model.save()
    } catch (e) {
        throw new ErrorHandling().getErrorMessage(e);
    }
}

/* update mongoose model*/
export const updateQuery = async (context: Context, model: Model<any>, map: any, doCheckForExistence?: boolean, filter?: any) => {
    try {
        if (doCheckForExistence === undefined) {
            doCheckForExistence = true;
        }

        let data = null

        if (doCheckForExistence) {
            data = await getOneQuery(context, filter != undefined ?
                    model.find(filter) : model.findById(map.id));
        }

        if ((filter != undefined || map.id != undefined) && (data != undefined || doCheckForExistence === false)) {
            return await executeQuery(context, model.updateMany(filter != undefined ?
                filter : {'_id': map.id}, map));
        } else {
            throw new Error('No data found to update')
        }
    } catch (e) {
        throw new ErrorHandling().getErrorMessage(e);
    }
}

/* update mongoose model*/
export const deleteQuery = async (context: Context, model: Model<any>, id: string, doCheckForExistence?: boolean) => {
    try {
        if (doCheckForExistence === undefined) {
            doCheckForExistence = true;
        }
        let data = null

        if (doCheckForExistence) {
            data = await getOneQuery(context, model.findById(id));
        }
        if (data != undefined || doCheckForExistence === false) {
            await executeQuery(context, model.findByIdAndDelete(id));
        } else {
            throw 'No data found to update'
        }
    } catch (e) {
        throw new ErrorHandling().getErrorMessage(e);
    }
}

export const getRandomDataFromModel = async (context: Context, model: Model<any>) =>  {
    try {
        let randomData = {}
        while (true) {
            let count = await executeQuery(context, model.countDocuments());
            let random = Math.floor(Math.random() * count);
            const data = await executeQuery(context, model.findOne().skip(random));
            console.log('data issss ',data)
            if (data != undefined) {
                randomData = data
                break
            }
        }
        return randomData
    } catch(e) {
        throw new ErrorHandling().getErrorMessage(e);
    }
}
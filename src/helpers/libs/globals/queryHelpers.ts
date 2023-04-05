import { FilterQuery, Model, Query } from 'mongoose';
import { limitNumber } from '@helpers/libs/globals/globalVariables';
import { BaseModel } from '@helpers/libs/BaseModel';
import * as Mongoose from 'mongoose';
import AppError from '@/middlewares/error/AppError';

export const getObjectId = (id: string) => new Mongoose.Types.ObjectId(id);

export const getAllQuery = async (query: Query<any, any>, page?: number, populate?: any) => {
  try {
    let skip = 0;
    if (page > 1) {
      skip = (page - 1) * limitNumber;
    }

    if (populate != undefined) {
      return query.populate(populate).skip(skip).limit(limitNumber).sort({ $natural: -1 }).lean({ virtuals: true }).exec();
    } else
      return query
        .skip((page - 1) * limitNumber)
        .limit(limitNumber)
        .sort({ $natural: -1 })
        .lean({ virtuals: true })
        .exec();
  } catch (e) {
    throw new AppError(400,e.toString())
  }
};

export const getOneQuery = async (query: Query<any, any>, populate?: any) => {
  try {
    if (populate != undefined) {
      return query.populate(populate).lean().exec();
    } else return query.lean().exec();
  } catch (e) {
    throw new AppError(400,e.toString())
  }
};
export const getOneQueryAggregate = async (query: FilterQuery<any>, populate?: any) => {
  try {
    if (populate != undefined) {
      return query.populate(populate).lean().exec();
    } else return query.lean().exec();
  } catch (e) {
    throw new AppError(400,e.toString())
  }
};

export const executeQuery = async (query: Query<any, any>) => {
  try {
    return query.lean().exec();
  } catch (e) {
    throw new AppError(400,e.toString())
  }
};

export const saveQuery = async (model: BaseModel) => {
  try {
    return model.save();
  } catch (e) {
    throw new AppError(400,e.toString())
  }
};

/* update mongoose model*/
export const updateQuery = async (model: Model<any>, map: any, doCheckForExistence?: boolean, filter?: any) => {
  try {
    if (doCheckForExistence === undefined) {
      doCheckForExistence = true;
    }

    let data = null;

    if (doCheckForExistence) {
      data = await getOneQuery(filter != undefined ? model.find(filter) : model.findById(map.id));
    }

    if ((filter != undefined || map.id != undefined) && (data != undefined || doCheckForExistence === false)) {
      return await executeQuery(model.updateMany(filter != undefined ? filter : { _id: map.id }, map));
    } else {
      throw new Error('No data found to update');
    }
  } catch (e) {
    throw new AppError(400,e.toString())
  }
};

/* update mongoose model*/
export const deleteQuery = async (model: Model<any>, id: string, doCheckForExistence?: boolean) => {
  try {
    if (doCheckForExistence === undefined) {
      doCheckForExistence = true;
    }
    let data = null;

    if (doCheckForExistence) {
      data = await getOneQuery(model.findById(id));
    }
    if (data != undefined || doCheckForExistence === false) {
      await executeQuery(model.findByIdAndDelete(id));
    } else {
      throw 'No data found to update';
    }
  } catch (e) {
    throw new AppError(400,e.toString())
  }
};

export const getRandomDataFromModel = async (model: Model<any>) => {
  try {
    let randomData = {};
    while (true) {
      const count = await executeQuery(model.countDocuments());
      const random = Math.floor(Math.random() * count);
      const data = await executeQuery(model.findOne().skip(random));
      console.log('data issss ', data);
      if (data != undefined) {
        randomData = data;
        break;
      }
    }
    return randomData;
  } catch (e) {
    throw new AppError(400,e.toString())
  }
};

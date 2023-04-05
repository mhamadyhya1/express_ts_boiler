import { Model, Models, QueryWithHelpers } from "mongoose";
import { BaseModel } from "./BaseModel";
import AppError from "@/middlewares/error/AppError";
type MongooseModel<T extends BaseModel, QueryHelpers = {}> = Model<T, QueryWithHelpers<Record<string, unknown>, T>, undefined>;

export const findQuery = function<T extends BaseModel, QueryHelpers>(model: MongooseModel<T, QueryHelpers>,condition?:{}) {
    try{
        return function() {
            return model.find(condition).exec();
          }
    }
    catch(e){
        throw new AppError(400,e.toString())
    }
}
export const saveQuery = async (model: BaseModel) => {
    try {
      return model.save();
    } catch (e) {
      throw new AppError(400,e.toString())
    }
};
import config from '@/config/config';
import ApiError from '@/helpers/libs/globals/ApiError';
import { saveQuery } from '@/helpers/libs/globals/queryHelpers';
import Token from '@/mvc/token/models/schema/Token';
import * as argon2 from 'argon2';
import httpStatus from 'http-status';
import { ILogin, IUserDoc, NewRegisterUser } from '../models/interface/IUser';
import User from '../models/schema/User';

class UserServices {
  async registerUser(data: NewRegisterUser): Promise<{}> {
    if (await User.isEmailTaken(data.email)) {
      throw new ApiError(400, 'Email already Taken');
    }
    const request = await saveQuery(new User(data));
    return request;
  }
  getUserByEmail = async (email: string): Promise<IUserDoc | null> => User.findOne({ email }, { email: 1, username: 1, password: 1 });
  async loginUserWithEmailAndPass(data: ILogin): Promise<{}> {
    const user = await this.getUserByEmail(data.email);
    if (!user || (await argon2.verify(user.password, data.password)) === false) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
    }
    return user;
  }
  loginUserWithEmailAndPassword = async (data: ILogin): Promise<IUserDoc> => {
    const user = await this.getUserByEmail(data.email);
    if (!user || !(await argon2.verify(user.password, data.password))) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
    }
    return user;
  };
  logout = async (refreshToken: string): Promise<void> => {
    const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: config.jwt.secret.REFRESH, blacklisted: false });
    if (!refreshTokenDoc) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
    }
    await refreshTokenDoc.deleteOne();
  };
}

export default UserServices;

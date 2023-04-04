import config from '../../config/config';
import moment from 'moment';
import * as argon from 'argon2';
import mongoose from 'mongoose';
import { jest } from '@jest/globals';
import { faker } from '@faker-js/faker';
import { generateToken } from '../../mvc/token/testing/jwtTest';
import afterAll, { beforeEach, describe, test } from 'node:test';
import { NewRegisterUserTest1 } from '@/mvc/user/models/interface/IUser';
import httpStatus from 'http-status';
import app from '../../..';
import request from 'supertest';
import setupTestDB from '@/config/jestDB';
import User from '../user/models/schema/User';

setupTestDB();

const password = 'password1';
const saltLength = 10;
const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
const hashedPassword = argon.hash(password, { saltLength });

const userFake = {
  _id: new mongoose.Types.ObjectId(),
  name: faker.name.fullName(),
  email: faker.internet.email().toLowerCase(),
  username: faker.internet.userName(),
  password,
};

const userFakeAccessToken = generateToken(userFake._id, accessTokenExpires, 'access', 'secret');

describe('Auth Routes', () => {
  describe('POST /user/register', () => {
    let newUser: NewRegisterUserTest1;
    beforeEach(() => {
      newUser = {
        name: faker.name.fullName(),
        username: faker.internet.userName(),
        email: faker.internet.email().toLowerCase(),
        password: 'password1',
      };
    });

    test('should return 201 and successfully register user if request data is ok', async () => {
      const res = await request(app).post('/api/user/register').send(newUser).expect(httpStatus.CREATED);

      expect(res.body.user).not.toHaveProperty('password');
      expect(res.body.user).toEqual({
        id: expect.anything(),
        name: newUser.name,
        email: newUser.email,
        role: 'user',
        isEmailVerified: false,
      });
      const dbUser = await User.findById(res.body.user.id);
      expect(dbUser).toBeDefined();
      expect(dbUser).toMatchObject({ name: newUser.name, email: newUser.email, role: 'user', isEmailVerified: false });

      expect(res.body.tokens).toEqual({
        access: { token: expect.anything(), expires: expect.anything() },
        refresh: { token: expect.anything(), expires: expect.anything() },
      });
    });
    test('should return 400 error if email is invalid', async () => {
      newUser.email = 'Email not exists';

      await request(app).post('/api/user/register').send(newUser).expect(httpStatus.BAD_REQUEST);
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});

import express from 'express';
import { userController } from '../controllers';

const userRoutes = express.Router();
userRoutes.post('/user/register', userController.registerUser);
userRoutes.post('/user/login', userController.login);

export default userRoutes;

import { auth, userAuth } from '@/../middlewares';
import express from 'express';
import { userController } from '../controllers';
import { Routes } from './routesStrings';

const router = express.Router();

router.get(Routes.profile, [auth, userAuth], userController.UserProfile);
router.post(Routes.update, [auth, userAuth], userController.UserUpdate);

export default router;

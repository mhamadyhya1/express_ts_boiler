import { verifyToken } from '@/middlewares/userAuth';
import express from 'express';
import roleControllers from './controller';

const roleRoutes = express.Router();
roleRoutes.post('/role/create', roleControllers.createRole);
roleRoutes.post('/role/check', verifyToken, roleControllers.checkRole);

export default roleRoutes;

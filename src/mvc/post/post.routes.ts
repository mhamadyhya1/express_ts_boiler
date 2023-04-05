import { verifyToken } from '@/middlewares/userAuth';
import express from 'express';
import postControllers from './controllers';

const postRoutes = express.Router();
postRoutes.post('/post/create',verifyToken, postControllers.createPost);
postRoutes.get('/post/list/{id}', verifyToken, postControllers.getPostByUser);

export default postRoutes;
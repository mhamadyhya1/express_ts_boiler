import postRoutes from '@/mvc/post/post.routes';
import roleRoutes from '@/mvc/role/role.routes';
import userRoutes from '@/mvc/user/routes/routes';
import { Express } from 'express';
import ratelimit from 'express-rate-limit';
export default (app: Express) => {
  const limiter = ratelimit({
    max: 100,
    windowMs: 60000,
    message: 'Too many request from this IP!,Please try again after an hour',
  });
  app.use('/api', postRoutes, limiter);
  app.use('/api', userRoutes, limiter);
  app.use('/api', roleRoutes, limiter);
};

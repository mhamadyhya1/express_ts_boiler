import roleRoutes from '@/mvc/role/role.routes';
import testRoutes from '@/mvc/test/routes/test.routes';
import userRoutes from '@/mvc/user/routes/routes';
import { Express } from 'express';
import ratelimit from 'express-rate-limit';
export default (app: Express) => {
  const limiter = ratelimit({
    max: 100,
    windowMs: 120000,
    message: 'Too many request from this IP!,Please try again after an hour',
  });
  app.use('/api', testRoutes, limiter);
  app.use('/api', userRoutes, limiter);
  app.use('/api', roleRoutes, limiter);
};

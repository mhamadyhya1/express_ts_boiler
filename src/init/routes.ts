import roleRoutes from '@/mvc/role/role.routes';
import testRoutes from '@/mvc/test/routes/test.routes';
import userRoutes from '@/mvc/user/routes/routes';
import { Express } from 'express';

export default (app: Express) => {
  app.use('/', testRoutes);
  app.use('/', userRoutes);
  app.use('/', roleRoutes);
};

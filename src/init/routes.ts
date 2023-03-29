import { Express } from 'express';

import { authRouter, userRouter } from '../mvc/users/routes';
import { Routes } from '../mvc/users/routes/routesStrings/index';

export default (app: Express) => {
  app.use('/', authRouter);
  app.use(Routes.user, userRouter);
};

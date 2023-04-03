import express from 'express';
import { testController } from '../controllers';

const testRoutes = express.Router();
testRoutes.post('/test/create', testController.createTest);

export default testRoutes;

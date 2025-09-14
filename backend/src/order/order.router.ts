import { Router } from 'express';
import { createOrder } from './order.controller';
import { orderRouteValidator } from './order.controller';
import { errorHandler } from '../middlewares/errorHandler';

const orderRouter = Router();
const rootPath = '/order';

orderRouter.post(rootPath, orderRouteValidator, createOrder);

export default orderRouter;

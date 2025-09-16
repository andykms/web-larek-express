import { Router } from 'express';
import { createOrder } from './order.controller';
import { orderRouteValidator } from './order.validator';

const orderRouter = Router();
const rootPath = '/order';

orderRouter.post(rootPath, orderRouteValidator, createOrder);

export default orderRouter;

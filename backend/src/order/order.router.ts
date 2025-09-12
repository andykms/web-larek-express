import { Router } from "express";
import { orderValidator, createOrder } from "./order.controller";

const orderRouter = Router();
const rootPath = "/order";

orderRouter.post(rootPath, orderValidator, createOrder);

export default orderRouter;
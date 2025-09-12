import { getProducts, createProduct } from "./product.controller";
import { Router } from "express";

const productRouter = Router();

const rootPath = '/product'

productRouter.get(rootPath, getProducts);
productRouter.post(rootPath, createProduct);

export default productRouter;

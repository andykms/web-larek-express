import { getProducts, createProduct } from './product.controller';
import { Router } from 'express';
import { productRouteValidator } from './product.controller';

const productRouter = Router();

const rootPath = '/product';

productRouter.get(rootPath, getProducts);
productRouter.post(rootPath, productRouteValidator, createProduct);

export default productRouter;

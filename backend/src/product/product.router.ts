import { getProducts, createProduct, patchProduct } from './product.controller';
import { Router } from 'express';
import { productPostValidator, productUpdateValidator } from './product.validator';

const productRouter = Router();

const rootPath = '/product';

productRouter.get(rootPath, getProducts);
productRouter.post(rootPath, productPostValidator, createProduct);
productRouter.patch(`${rootPath}/:id`, productUpdateValidator, patchProduct);

export default productRouter;

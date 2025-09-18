import { Router } from 'express';
import { getProducts, createProduct, patchProduct, deleteProduct } from './product.controller';
import { productPostValidator, productUpdateValidator } from './product.validator';
import auth from '../middlewares/auth';

const productRouter = Router();

const rootPath = '/product';

productRouter.get(rootPath, getProducts);
productRouter.post(rootPath, auth, productPostValidator, createProduct);
productRouter.patch(`${rootPath}/:id`, auth, productUpdateValidator, patchProduct);
productRouter.delete(`${rootPath}/:id`, auth, deleteProduct);

export default productRouter;

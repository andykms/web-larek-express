import { Response, Request, NextFunction } from 'express';
import Product from './product.model';
import { BadRequestError } from '../errors/bad-request-error';
import { ConflictError } from '../errors/conflict-error';
import { Error as MongooseError } from 'mongoose';
import { InternalServerError } from '../errors/server-error';
import { productValidSchema } from './product.model';
import { celebrate, Segments } from 'celebrate';
import { move } from '../utils/move';
import path from 'path';

export const productRouteValidator = celebrate({
    [Segments.BODY]: productValidSchema,
});

export function getProducts(req: Request, res: Response, next: NextFunction) {
    Product.find({})
        .then((products) => {
            res.status(200).send({
                items: products,
                total: products.length,
            });
        })
        .catch(() => {
            return next(new InternalServerError());
        });
}

export async function createProduct(req: Request, res: Response, next: NextFunction) {
    const productData = req.body;
    try {
        const from = path.join('../../uploads', productData.image.fileName);
        const to = path.join('../../public', productData.image.fileName);
        await move(path.join(__dirname, from), path.join(__dirname, to));
        const product = await Product.create(productData);
        return res.status(201).send(product);
    } catch (error) {
        if (error instanceof MongooseError.ValidationError) {
            return next(new BadRequestError());
        }
        if (error instanceof Error && error.message.includes('E11000')) {
            return next(new ConflictError());
        }
        return next(new InternalServerError());
    }
}

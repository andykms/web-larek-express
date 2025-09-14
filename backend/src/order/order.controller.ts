import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../errors/bad-request-error';
import Product from '../product/product.model';
import { faker } from '@faker-js/faker';
import { orderValidSchema } from './order.model';
import { celebrate, Segments } from 'celebrate';

export async function createOrder(req: Request, res: Response, next: NextFunction) {
    const { total, items } = req.body;
    let realSumm = 0;
    for (const id of items) {
        try {
            const product = await Product.findById(id);
            if (!product) {
                next(new BadRequestError());
                return;
            }
            if (!product.price && product.price !== 0) {
                next(new BadRequestError());
                return;
            }
            realSumm += product.price;
        } catch {
            next(new BadRequestError());
            return;
        }
    }
    if (realSumm !== total) {
        next(new BadRequestError());
        return;
    }

    res.status(201).send({
        id: faker.string.uuid(),
        total: total,
    });
}

export const orderRouteValidator = celebrate({
    [Segments.BODY]: orderValidSchema,
});

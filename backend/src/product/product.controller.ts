import { Response, Request, NextFunction } from 'express';
import Product from './product.model';
import { BadRequestError } from '../errors/bad-request-error';
import { ConflictError } from '../errors/conflict-error';
import { Error as MongooseError } from 'mongoose';
import { InternalServerError } from '../errors/server-error';
import { move } from '../utils/move';
import { deleteFile } from '../utils/delete';
import path from 'path';
import { NotFoundError } from '../errors/not-found-error';

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

export async function patchProduct(req: Request, res: Response, next: NextFunction) {
    if (!req.params.id) {
        return next(new BadRequestError());
    }
    const productData = req.body;
    try {
        if (productData.image) {
            const from = path.join('../../uploads', productData.image.fileName);
            const to = path.join('../../public', productData.image.fileName);
            await move(path.join(__dirname, from), path.join(__dirname, to));
            const oldProduct = await Product.findById(req.params.id);
            if (oldProduct) {
                await deleteFile(path.join(__dirname, '../../public', oldProduct.image.fileName));
            }
        }
        const product = await Product.findByIdAndUpdate(req.params.id, productData, {
            new: true,
            runValidators: true,
        });
        return res.status(200).send(product);
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

export async function deleteProduct(req: Request, res: Response, next: NextFunction) {
    if (!req.params.id) {
        return next(new BadRequestError());
    }
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (product) {
            await deleteFile(path.join(__dirname, '../../public', product.image.fileName));
        } else {
            return next(new NotFoundError());
        }
        return res.status(200).send(product);
    } catch (error) {
        return next(new InternalServerError());
    }
}

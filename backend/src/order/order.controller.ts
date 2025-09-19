/* eslint-disable import/prefer-default-export */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable import/no-extraneous-dependencies */
import { Request, Response, NextFunction } from 'express';
import { faker } from '@faker-js/faker';
import BadRequestError from '../errors/bad-request-error';
import Product from '../product/product.model';

export async function createOrder(req: Request, res: Response, next: NextFunction) {
  const { total, items } = req.body;
  let realSumm = 0;
  for (const id of items) {
    try {
      const product = await Product.findById(id);
      if (!product) {
        return next(new BadRequestError());
      }
      if (!product.price && product.price !== 0) {
        return next(new BadRequestError());
      }
      realSumm += product.price;
    } catch {
      return next(new BadRequestError());
    }
  }
  if (realSumm !== total) {
    return next(new BadRequestError());
  }

  return res.status(201).send({
    id: faker.string.uuid(),
    total,
  });
}

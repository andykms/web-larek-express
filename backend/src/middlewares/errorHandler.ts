import { Response, Request, NextFunction } from 'express';
import type IError from '../errors/type-error';

export default function errorHandler(err: unknown, _: Request, res: Response, __: NextFunction) {
  res
    .status((err as IError).statusCode || 500)
    .send((err as IError).message || 'ошибка выполнения запроса');
}

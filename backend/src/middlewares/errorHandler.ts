import { Response, Request, NextFunction } from 'express';
import { IError } from '../errors/type-error';

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
    res.status((err as IError).statusCode || 500).send(
        (err as IError).message || 'ошибка выполнения запроса',
    );
}

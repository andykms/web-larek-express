import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

import UnauthorizedError from '../errors/unauthorized-error';

dotenv.config({ path: './.env' });

const accessTokenSecret = process.env.AUTH_ACCESS_TOKEN_SECRET;

if (!accessTokenSecret) {
  throw new Error('не найдены секретные подписи для jwt');
}

export default async function auth(req: Request, _: Response, next: NextFunction) {
  const headerToken = req.headers.authorization;
  if (!headerToken || !headerToken.startsWith('Bearer ')) {
    return next(new UnauthorizedError('отсутствует токен'));
  }
  const token = headerToken.replace('Bearer ', '');
  let payload: string | JwtPayload;
  try {
    payload = await jwt.verify(token, accessTokenSecret!);
  } catch {
    return next(new UnauthorizedError());
  }
  req.user = typeof payload === 'string' ? JSON.parse(payload) : payload;
  return next();
}

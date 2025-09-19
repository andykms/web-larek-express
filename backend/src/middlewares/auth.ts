import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AUTH_ACCESS_TOKEN_SECRET as accessTokenSecret } from '../utils/constants';
import UnauthorizedError from '../errors/unauthorized-error';

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
  req.user = payload;
  return next();
}

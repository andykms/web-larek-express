import { JwtPayload } from 'jsonwebtoken';

export default function getValidJwtPayload(token: string | JwtPayload): string {
  if (typeof token === 'string') {
    return token;
  }
  return token._id;
}

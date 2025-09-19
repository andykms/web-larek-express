import type IError from './type-error';

export default class UnauthorizedError extends Error implements IError {
  public statusCode = 401;

  constructor(message?: string) {
    super(message || 'не авторизован');
  }
}

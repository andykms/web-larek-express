import type IError from './type-error';

export default class NotFoundError extends Error implements IError {
  public statusCode: number;

  constructor(message?: string) {
    super(message || 'ресурс не найден');
    this.statusCode = 404;
  }
}

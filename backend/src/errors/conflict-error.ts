import type IError from './type-error';

export default class ConflictError extends Error implements IError {
  public statusCode: number;

  constructor(message?: string) {
    super(message || 'ресурс уже существует');
    this.statusCode = 409;
  }
}

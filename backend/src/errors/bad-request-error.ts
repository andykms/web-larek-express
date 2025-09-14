import type { IError } from './type-error';

export class BadRequestError extends Error implements IError {
    public statusCode: number;

    constructor(message?: string) {
        super(message || 'данные не валидны');
        this.statusCode = 400;
    }
}

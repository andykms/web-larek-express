import type { IError } from './type-error';

export class InternalServerError extends Error implements IError {
    public statusCode: number;

    constructor(message?: string) {
        super(message || 'ошибка обработки запроса');
        this.statusCode = 500;
    }
}

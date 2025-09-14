import winston from 'winston';
import expressWinston from 'express-winston';
import path from 'path';

export const requestLogger = expressWinston.logger({
    transports: [
        new winston.transports.File({ filename: path.join(__dirname, '../../logs/requests.log') }),
    ],
    format: winston.format.json(),
});

export const errorLogger = expressWinston.errorLogger({
    transports: [
        new winston.transports.File({ filename: path.join(__dirname, '../../logs/errors.log') }),
    ],
    format: winston.format.json(),
});

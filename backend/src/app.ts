import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import productRouter from './product/product.router';
import orderRouter from './order/order.router';
import path from 'path';
import cors from 'cors';
import { requestLogger, errorLogger } from './middlewares/logger';
import { Response, Request } from 'express';
import { errorHandler } from './middlewares/errorHandler';
import cron from 'node-cron';
import { uploadCleaner } from './utils/uploadCleaner';
import uploadRouter from './uploadService/upload.router';
import userRouter from './user/user.router';

dotenv.config({ path: './.env' });

const app = express();

const dbUrl = process.env.DB_ADDRESS;
const { PORT = 3000 } = process.env;

if (dbUrl) {
    mongoose.connect(dbUrl);
} else {
    throw new Error('невозможно подключиться к базе данных');
}

cron.schedule('*/5 * * * *', uploadCleaner);

//Основные мидлвары
app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
    }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

//Логи запросов
app.use(requestLogger);

//Роуты сущностей
app.use(productRouter);
app.use(orderRouter);
app.use(uploadRouter);
app.use(userRouter);

//Логи ошибок
app.use(errorLogger);

//Перехватчик ошибок
app.use(errorHandler);

app.get('/coffee', (req: Request, res: Response) => {
    res.status(418).send({ message: "I'm teapot, not coffeepot!" });
});

app.listen(PORT, () => {
    console.log('start');
});

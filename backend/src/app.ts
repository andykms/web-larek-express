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

dotenv.config({ path: './.env' });

const app = express();

const dbUrl = process.env.DB_ADDRESS;
const { PORT = 3000 } = process.env;

if (dbUrl) {
    mongoose.connect(dbUrl);
} else {
    throw new Error("Don't connect to DB | Невозможно подключиться к базе данных");
}

//Основные мидлвары
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.use(cors());

//Логи запросов
app.use(requestLogger);

//Роуты сущностей
app.use(productRouter);
app.use(orderRouter);

//Логи ошибок
app.use(errorLogger);

//Перехватчик ошибок
app.use(errorHandler);

app.get('/coffeepot', (req: Request, res: Response) => {
    res.status(418).send({ message: "I'm teapot, not coffeepot!" });
});

app.listen(PORT, () => {
    console.log('start');
});

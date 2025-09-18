import express from 'express';
import mongoose from 'mongoose';
import cron from 'node-cron';
import path from 'path';
import cors from 'cors';
import cookieparser from 'cookie-parser';
import productRouter from './product/product.router';
import orderRouter from './order/order.router';
import { requestLogger, errorLogger } from './middlewares/logger';
import errorHandler from './middlewares/errorHandler';
import uploadCleaner from './utils/uploadCleaner';
import uploadRouter from './uploadService/upload.router';
import userRouter from './user/user.router';
import { DB_ADDRESS, PORT } from './utils/constants';

const app = express();

if (DB_ADDRESS) {
  mongoose.connect(DB_ADDRESS);
} else {
  throw new Error('невозможно подключиться к базе данных');
}

cron.schedule('*/1 * * * *', uploadCleaner);

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.use(cookieparser());

app.use(requestLogger);

app.use(productRouter);
app.use(orderRouter);
app.use(uploadRouter);
app.use(userRouter);

app.use(errorLogger);

app.use(errorHandler);

app.listen(PORT);

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
import { walk } from './utils/walkFiles';
import { deleteFile } from './utils/delete';
import cron from 'node-cron';
import { MAX_FILE_TIME_IN_MS, FILES_TIMEOUTS } from './utils/constants';
import uploadRouter from './uploadService/upload.router';

dotenv.config({ path: './.env' });

const app = express();

const dbUrl = process.env.DB_ADDRESS;
const { PORT = 3000 } = process.env;

if (dbUrl) {
    mongoose.connect(dbUrl);
} else {
    throw new Error('невозможно подключиться к базе данных');
}

const uploadPath = path.join(__dirname, '../uploads');

cron.schedule('*/5 * * * *', async () => {
    try {
        const checkedFiles = await walk(uploadPath);
        const now = Date.now();
        checkedFiles.forEach((file) => {
            const timestamp = FILES_TIMEOUTS.get(file);
            if ((timestamp && Math.abs(now - timestamp) > MAX_FILE_TIME_IN_MS) || !timestamp) {
                FILES_TIMEOUTS.delete(file);
                deleteFile(path.join(__dirname, '../uploads', file));
            }
            deleteFile(file);
        });
    } catch (err) {
        throw new Error(`ошибка удаления файлов в папке uploads: ${err}`);
    }
});

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
app.use(uploadRouter);

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

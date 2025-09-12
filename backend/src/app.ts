import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import productRouter from "./product/product.router";
import orderRouter from "./order/order.router";
import path from "path";
import cors from "cors";

dotenv.config({ path: "./.env" });

const app = express();

const dbUrl = process.env.DB_ADDRESS;
const { PORT = 3000 } = process.env;

if (dbUrl) {
  mongoose.connect(dbUrl);
} else {
  throw new Error(
    "Don't connect to DB | Невозможно подключиться к базе данных"
  );
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.use(cors())

app.use(productRouter);
app.use(orderRouter);

app.listen(PORT, () => {
  console.error("418 - I'm teapot, not coffeepot");
});

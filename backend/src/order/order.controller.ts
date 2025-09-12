import Product from "../product/product.model";
import Order from "./order.model";
import { Request, Response, NextFunction } from "express";
import { faker } from "@faker-js/faker";

export async function orderValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const data = req.body;
  try {
    //Общая проверка на соотвествие схемы.
    await Order.validate(data);
    const items = data.items;

    //Проверка, что массив не пуст.
    if (items.length <= 0) {
      throw new Error();
    }

    //Проверка, что сумма заказа верна.
    const { total } = data;
    let summOfItems = 0;
    for (const id of items) {
      const product = await Product.findById(id);
      //Доп. проверка
      if (!product || !product.price) {
        throw new Error("not found product");
      }
      summOfItems += product.price;
    }
    if (summOfItems !== total) {
      throw new Error(`not valid price`);
    }
    next();
  } catch (err) {
    /*Если несоответсвие схемы, или массив пуст, или общая сумма не соответсвует 
    высчитанной сумме по id.
    */
    res.status(400).send({ message: "не валидные данные заказа" });
  }
}

export function createOrder(req: Request, res: Response) {
  const { total } = req.body;
  res.status(201).send({
    id: faker.string.uuid(),
    total,
  });
}

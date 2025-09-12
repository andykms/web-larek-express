import mongoose from "mongoose";
import Product from "../product/product.model";
import { celebrate, Joi, Segments } from 'celebrate';

const emailRegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

interface IOrder {
  items: string[],
  total: number,
  payment: string,
  email: string,
  phone: string,
  address: string,
}

export const orderSchema = new mongoose.Schema<IOrder>({
  items: [{
    type: String,
    validate: {
      async validator(id: string) {
        try {
          const product = await Product.findById(id)
          if(!product) {
            throw new Error();
          }
          if(product.price === null || isNaN(Number(product.price))) {
            throw new Error();
          }
          return true;
        } catch {
          return false;
        }
      },
      message: "Продукт не найден, или цена не валидна"
    }
  }],
  total: {
    type: Number,
    required: true,
  },
  payment: {
    type: String,
    enum: ["card", "online"],
    required: true
  },
  email: {
    type: String,
    required: true,
    match: emailRegExp
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true
  }
})

export default mongoose.model<IOrder>("order", orderSchema);
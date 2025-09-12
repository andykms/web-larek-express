import { Response, Request } from "express";
import Product from "./product.model";

export function getProducts(req: Request, res: Response) {
  Product.find({})
    .then((products) => {
      res.status(200).send({
        items: products,
        total: products.length,
      });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Произошла ну ОЧЕНЬ непредвиденная ошибка :,((((" });
    });
}

export function createProduct(req: Request, res: Response) {
  const productData = req.body;
  Product.create(productData)
    .then((product) => {
      res.status(201).send(product);
    })
    .catch((err) => {
      res.status(500).send({ message: "Произошла ошибка" });
    });
}

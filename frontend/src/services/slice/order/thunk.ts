import { IOrder, IOrderResult } from '../../../utils/types';
import { createAsyncThunk } from '../../hooks';

export const createOrder = createAsyncThunk<IOrderResult, IOrder>(
<<<<<<< HEAD
  'products/createOrder', (orderData, {extra: {orderProducts}}) => {
=======
  'order/createOrder', (orderData, {extra: {orderProducts}}) => {
>>>>>>> admin
    return orderProducts(orderData)
  }
);

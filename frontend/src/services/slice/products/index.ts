import { productsSlice } from './products-slice';
<<<<<<< HEAD
import { getProducts } from './thunk';



export const productsActions = { ...productsSlice.actions, getProducts };
=======
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct, uploadImageFile } from './thunk';



export const productsActions = { ...productsSlice.actions, getProducts, createProduct, deleteProduct, updateProduct, getProductById, uploadImageFile };
>>>>>>> admin
export const productsSelector = productsSlice.selectors;


export type { TProductState } from './type';

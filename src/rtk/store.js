import { configureStore } from "@reduxjs/toolkit";
// import BankReducer from "./slices/bank-slice";
// import ProductsReducer from "./slices/products-slice";
import productsSlice from "./slices/products-slice";
import cartSlice from "./slices/cart-slice";

export const store = configureStore({
    reducer: {
        products: productsSlice,
        cart: cartSlice,
    },
});

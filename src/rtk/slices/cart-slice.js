import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
    initialState: [],
    name: "cartSlice",
    reducers: {
        addToCart: (state, action) => {
            const foundProduct = state.find(
                (product) => product.id === action.payload.id
            );
            if (foundProduct) {
                foundProduct.quantity += 1;
            } else {
                const cartProduct = { ...action.payload, quantity: 1 };
                state.push(cartProduct);
            }
        },
        deleteFromCart: (state, action) => {
            return state.filter((state) => state.id !== action.payload.id);
        },
        clear: (state, action) => {
            return [];
        },
    },
});

export const { addToCart, deleteFromCart, clear } = cartSlice.actions;
export default cartSlice.reducer;

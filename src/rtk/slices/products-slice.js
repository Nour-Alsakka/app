import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const api_url = "https://fakestoreapi.com/products"; // ******

export const fetchProducts = createAsyncThunk(
    "productSlice/fetchProducts",
    async () => {
        // const res = await fetch("http://localhost:9000/products");
        const res = await fetch(api_url);
        const data = await res.json();
        return data;
    }
);

const productSlice = createSlice({
    initialState: [],
    name: "productSlice",
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchProducts.fulfilled, (state, action) => {
            return action.payload;
        });
    },
});

// export const {} = productSlice.actions;
export default productSlice.reducer;

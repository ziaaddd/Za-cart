import { createSlice } from "@reduxjs/toolkit";
import fetchProducts from "./actProducts";
import type { Tproduct } from "../../types/product";
import type { Tloading } from "../../types/shared";
import fetchFeaturedProducts from "./actFeaturedProducts";
import actGetProductById from "./actGetProductById";
import actGetRelatedProducts from "./actGetRelatedProducts";

interface IinitState {
  products: Tproduct[];
  status: Tloading;
  error: null | string;
  // // Featured products states
  featuredProducts: Tproduct[];
  featuredStatus: Tloading;
  featuredError: null | string;

  // Product Detail page
  productDetail: Tproduct | null;
  productDetailStatus: Tloading;
  productDetailError: null | string;

  // Related products
  relatedProducts: Tproduct[];
  relatedStatus: Tloading;
  relatedError: null | string;
}

const initState: IinitState = {
  products: [],
  status: "idle",
  error: null,
  featuredProducts: [],
  featuredStatus: "idle",
  featuredError: null,
  productDetail: null,
  productDetailStatus: "idle",
  productDetailError: null,
  relatedProducts: [],
  relatedStatus: "idle",
  relatedError: null,
};

const ProductsSlice = createSlice({
  name: "products",
  initialState: initState,
  reducers: {
    productsCleanUp: (state) => {
      state.products = [];
      state.status = "idle";
      state.error = null;
    },
    productDetailCleanUp: (state) => {
      state.productDetail = null;
      state.productDetailStatus = "idle";
      state.productDetailError = null;
      state.relatedProducts = [];
      state.relatedStatus = "idle";
      state.relatedError = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.pending, (state) => {
      state.status = "pending";
      state.error = null;
    });
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.products = action.payload;
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });
    //  Featured products (Home page)
    builder.addCase(fetchFeaturedProducts.pending, (state) => {
      state.featuredStatus = "pending";
      state.featuredError = null;
    });
    builder.addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
      state.featuredStatus = "succeeded";
      state.featuredProducts = action.payload;
    });
    builder.addCase(fetchFeaturedProducts.rejected, (state, action) => {
      state.featuredStatus = "failed";
      state.featuredError = action.payload as string;
    });
    //single product details
    builder.addCase(actGetProductById.pending, (state) => {
      state.productDetailStatus = "pending";
      state.productDetailError = null;
      state.productDetail = null;
    });
    builder.addCase(actGetProductById.fulfilled, (state, action) => {
      state.productDetailStatus = "succeeded";
      state.productDetail = action.payload;
    });
    builder.addCase(actGetProductById.rejected, (state, action) => {
      state.productDetailStatus = "failed";
      state.productDetailError = action.payload as string;
    });

    // Related products
    builder.addCase(actGetRelatedProducts.pending, (state) => {
      state.relatedStatus = "pending";
      state.relatedError = null;
    });
    builder.addCase(actGetRelatedProducts.fulfilled, (state, action) => {
      state.relatedStatus = "succeeded";
      state.relatedProducts = action.payload;
    });
    builder.addCase(actGetRelatedProducts.rejected, (state, action) => {
      state.relatedStatus = "failed";
      state.relatedError = action.payload as string;
    });
  },
});
export const { productsCleanUp, productDetailCleanUp } = ProductsSlice.actions;

export default ProductsSlice.reducer;

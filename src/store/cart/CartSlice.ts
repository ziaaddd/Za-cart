import { createSlice } from "@reduxjs/toolkit";
import type { Tproduct } from "../../types/product";
import getItemsInfo from "./actGetItemsInfo";
import type { Tloading } from "../../types/shared";
import {
  actAddToCartServer,
  actLoadCartFromServer,
  actUpdateCartServer,
} from "./actSyncCart";

interface IinitState {
  items: { [key: number]: number };
  ItemsFullInfo: Tproduct[];
  status: Tloading;
  error: null | string;
}

const initState: IinitState = {
  items: {},
  ItemsFullInfo: [],
  status: "idle",
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState: initState,
  reducers: {
    addToCart: (state, action) => {
      const id = action.payload;
      if (state.items[id]) {
        state.items[id]++; // this for its value not itself
      } else {
        state.items[id] = 1;
      }
    },
    removeCartItems: (state, action) => {
      delete state.items[action.payload];
      state.ItemsFullInfo = state.ItemsFullInfo.filter(
        (el) => el.id !== action.payload,
      );
    },
    CahngeCartItemQun: (state, action) => {
      state.items[action.payload.id] = action.payload.quantity;
    },
    cleanUpCartFullInfo: (state) => {
      state.ItemsFullInfo = [];
      state.error = null;
      state.status = "idle";
    },
    cleanUpCartAfterSubmitOrder: (state) => {
      state.items = {};
      state.ItemsFullInfo = [];
    },
  },
  //  get the full-info for cart products
  extraReducers: (builder) => {
    builder.addCase(getItemsInfo.pending, (state) => {
      state.status = "pending";
      state.error = null;
    });
    builder.addCase(getItemsInfo.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.ItemsFullInfo = action.payload;
    });
    builder.addCase(getItemsInfo.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });

    //  update cart items products in server
    builder.addCase(actAddToCartServer.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    //  update cart items products or remove  in server
    builder.addCase(actUpdateCartServer.fulfilled, (state, action) => {
      const { productId, quantity } = action.payload;
      if (quantity === 0) {
        delete state.items[productId];
        state.ItemsFullInfo = state.ItemsFullInfo.filter(
          (el) => el.id !== productId,
        );
      } else {
        state.items[productId] = quantity;
      }
    });
    builder.addCase(actUpdateCartServer.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    //  load cart items products from server
    builder.addCase(actLoadCartFromServer.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  },
});

export const {
  addToCart,
  removeCartItems,
  CahngeCartItemQun,
  cleanUpCartFullInfo,
  cleanUpCartAfterSubmitOrder,
} = cartSlice.actions;

export default cartSlice.reducer;

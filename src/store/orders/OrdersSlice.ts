import { createSlice } from "@reduxjs/toolkit";
import type { Tloading } from "../../types/shared";
import type { Torders } from "../../types/orders";
import actPlacingOrders from "./actOrders";
import actGetOrders from "./actGetOrders";

interface IinitState {
  orders: Torders[];
  status: Tloading;
  error: null | string;

  getOrdersStatus: Tloading;
  getOrdersError: null | string;
}

const initState: IinitState = {
  orders: [],
  status: "idle",
  error: null,
  getOrdersStatus: "idle",
  getOrdersError: null,
};

const OrdersSlice = createSlice({
  name: "orders",
  initialState: initState,
  reducers: {
    resetOrderStatus: (state) => {
      // state.orders = [];
      state.error = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(actPlacingOrders.pending, (state) => {
      state.status = "pending";
      state.error = null;
    });
    builder.addCase(actPlacingOrders.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.orders.unshift(action.payload.completeOrder);
    });
    builder.addCase(actPlacingOrders.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });
    // ── fetch order history (used by Orders page)
    builder.addCase(actGetOrders.pending, (state) => {
      state.getOrdersStatus = "pending";
      state.getOrdersError = null;
    });
    builder.addCase(actGetOrders.fulfilled, (state, action) => {
      state.getOrdersStatus = "succeeded";
      state.orders = action.payload;
    });
    builder.addCase(actGetOrders.rejected, (state, action) => {
      state.getOrdersStatus = "failed";
      state.getOrdersError = action.payload as string;
    });
  },
});
export const { resetOrderStatus } = OrdersSlice.actions;

export default OrdersSlice.reducer;

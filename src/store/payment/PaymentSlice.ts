import { createSlice } from "@reduxjs/toolkit";
import type { Tloading } from "../../types/shared";
import actCreateCheckoutSession from "./actCreateCheckoutSession";

interface IPaymentState {
  status: Tloading;
  error: string | null;
}

const initialState: IPaymentState = {
  status: "idle",
  error: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    resetPaymentStatus(state) {
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(actCreateCheckoutSession.pending, (state) => {
      state.status = "pending";
      state.error = null;
    });

    builder.addCase(actCreateCheckoutSession.fulfilled, (state) => {
      state.status = "succeeded";
    });
    builder.addCase(actCreateCheckoutSession.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload ?? "Payment failed. Please try again.";
    });
  },
});

export const { resetPaymentStatus } = paymentSlice.actions;
export default paymentSlice.reducer;

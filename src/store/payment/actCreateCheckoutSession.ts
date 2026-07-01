import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { TcheckoutForm } from "../../validations/checkout";

interface ICheckoutPayload {
  shippingData: TcheckoutForm;
  discount: number;
  coupon: string | null;
}

const actCreateCheckoutSession = createAsyncThunk<
  void, // fulfilled payload we redirect > so nothing to return
  ICheckoutPayload,
  { rejectValue: string }
>(
  "payment/createCheckoutSession",
  async ({ shippingData, discount, coupon }, thunkAPI) => {
    const { getState, rejectWithValue } = thunkAPI;
    const state = getState() as RootState;
    const { token } = state.auth;
    const { ItemsFullInfo, items } = state.cart;

    if (!token) return rejectWithValue("You must be logged in to checkout.");
    if (!ItemsFullInfo.length) return rejectWithValue("Your cart is empty.");

    // Build the items payload
    const cartItems = ItemsFullInfo.map((product) => ({
      id: product.id!,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: items[product.id!] ?? 1,
    }));

    const { supabase } = await import("../../services/supabase");
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      return rejectWithValue("Session expired. Please log in again.");
    }

    const functionsUrl = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL;
    if (!functionsUrl) {
      return rejectWithValue(
        "Payment service is not configured. Please contact support.",
      );
    }

    const response = await fetch(
      `https://${functionsUrl}.supabase.co/functions/v1/create-checkout-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          items: cartItems,
          shippingData,
          discount,
          coupon,
          origin: window.location.origin,
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return rejectWithValue(
        errorData.error ?? `Payment service error (${response.status})`,
      );
    }

    const { url } = await response.json();

    if (!url) {
      return rejectWithValue("No checkout URL returned. Please try again.");
    }
    window.location.href = url;
  },
);

export default actCreateCheckoutSession;

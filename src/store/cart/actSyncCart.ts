import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../services/supabase";
import type { RootState } from "../store";

// Called when user adds a product to cart
export const actAddToCartServer = createAsyncThunk(
  "cart/addToServer",
  async (productId: number, thunkAPI) => {
    const { rejectWithValue, getState } = thunkAPI;
    const { cart, auth } = getState() as RootState;
    const newQuantity = cart.items[productId] ?? 1;

    const userId = auth.user?.id;

    const { error } = await supabase
      .from("cart")
      .upsert(
        { product_id: productId, quantity: newQuantity, user_id: userId },
        { onConflict: "user_id,product_id" },
      );

    if (error) return rejectWithValue(error.message);
    return productId;
  },
);

// Called when user removes or changes quantity
export const actUpdateCartServer = createAsyncThunk(
  "cart/updateServerCart",
  async (
    { productId, quantity }: { productId: number; quantity: number },
    thunkAPI,
  ) => {
    const { rejectWithValue, getState } = thunkAPI;
    const { auth } = getState() as RootState;
    const userId = auth.user?.id;

    if (!userId) return rejectWithValue("User not logged in");

    if (quantity === 0) {
      const { error } = await supabase
        .from("cart")
        .delete()
        .eq("user_id", userId)
        .eq("product_id", productId);

      if (error) return rejectWithValue(error.message);
    } else {
      const { error } = await supabase
        .from("cart")
        .upsert(
          { product_id: productId, quantity, user_id: userId },
          { onConflict: "user_id,product_id" },
        );

      if (error) return rejectWithValue(error.message);
    }
    return { productId, quantity };
  },
);

// Called on login >> loads the user's cart from Supabase into Redux
export const actLoadCartFromServer = createAsyncThunk(
  "cart/loadFromServer",
  async (_, thunkAPI) => {
    const { rejectWithValue, getState } = thunkAPI;

    const { auth } = getState() as RootState;
    const userId = auth.user?.id;

    const { data, error } = await supabase
      .from("cart")
      .select("product_id, quantity")
      .eq("user_id", userId);

    if (error) return rejectWithValue(error.message);

    // convert array to the shape redux expects: { [id]: quantity } // this will help in catch cart products
    const items: { [key: number]: number } = {};
    data.forEach((row) => {
      items[row.product_id] = row.quantity;
    });
    return items;
  },
);

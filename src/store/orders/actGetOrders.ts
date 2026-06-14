import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../services/supabase";
import type { RootState } from "../store";
import type { Torders } from "../../types/orders";

const actGetOrders = createAsyncThunk<Torders[]>(
  "orders/getOrders",
  async (_, thunkAPI) => {
    const { rejectWithValue, getState, signal } = thunkAPI;
    const { auth } = getState() as RootState;

    const userId = auth.user?.id;
    if (!userId)
      return rejectWithValue("You must be logged in to view orders.");

    const { data, error } = await supabase
      .from("orders")
      .select(
        `
    *,
    orderItems (*)
  `,
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .abortSignal(signal);

    if (error) return rejectWithValue(error.message);
    return data ?? [];
  },
);

export default actGetOrders;

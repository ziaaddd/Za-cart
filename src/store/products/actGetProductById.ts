import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../services/supabase";
import type { Tproduct } from "../../types/product";

const actGetProductById = createAsyncThunk<Tproduct, number>(
  "products/getById",
  async (productId, thunkAPI) => {
    const { rejectWithValue, signal } = thunkAPI;
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .abortSignal(signal)
      .single();

    if (error) return rejectWithValue(error.message);
    return data;
  },
);

export default actGetProductById;

import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../services/supabase";
import type { Tproduct } from "../../types/product";

type TResponse = Tproduct[];

const fetchProducts = createAsyncThunk<TResponse, number>(
  "categories/fetchProducts",
  async (categoryId: number, thunkAPI) => {
    const { rejectWithValue, signal } = thunkAPI;
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", categoryId)
      .order("created_at", { ascending: false })
      .abortSignal(signal);

    if (error) return rejectWithValue(error.message);
    return data ?? [];
  },
);
export default fetchProducts;

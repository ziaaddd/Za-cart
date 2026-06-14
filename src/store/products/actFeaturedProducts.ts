import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../services/supabase";
import type { Tproduct } from "../../types/product";

// Fetches the 20 most recently added products across  categories.
const fetchFeaturedProducts = createAsyncThunk<Tproduct[]>(
  "products/fetchFeatured",
  async (_, thunkAPI) => {
    const { rejectWithValue, signal } = thunkAPI;

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20)
      .abortSignal(signal);

    if (error) return rejectWithValue(error.message);
    return data ?? [];
  },
);

export default fetchFeaturedProducts;

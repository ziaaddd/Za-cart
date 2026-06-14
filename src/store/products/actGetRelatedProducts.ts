import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../services/supabase";
import type { Tproduct } from "../../types/product";

interface Params {
  categoryId: number;
  excludeProductId: number;
}

const actGetRelatedProducts = createAsyncThunk<Tproduct[], Params>(
  "products/getRelated",
  async ({ categoryId, excludeProductId }, thunkAPI) => {
    const { rejectWithValue, signal } = thunkAPI;
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", categoryId)
      .neq("id", excludeProductId)
      .limit(4)
      .order("created_at", { ascending: false })
      .abortSignal(signal);

    if (error) return rejectWithValue(error.message);
    return data ?? [];
  },
);

export default actGetRelatedProducts;

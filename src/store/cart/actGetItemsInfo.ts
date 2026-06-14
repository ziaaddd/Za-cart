import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Tproduct } from "../../types/product";
import type { RootState } from "../store";
import { supabase } from "../../services/supabase";

type TResponse = Tproduct[];

const getItemsInfo = createAsyncThunk<TResponse>(
  "cart/getItemsInfo",
  async (_, thunkAPI) => {
    // getState to access state here instead of receiveing it as parameter
    const { rejectWithValue, fulfillWithValue, getState, signal } = thunkAPI;
    const { cart } = getState() as RootState;
    const itemsId = Object.keys(cart.items).map(Number);

    if (!itemsId.length) {
      return fulfillWithValue([]);
    }

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .in("id", itemsId)
      .abortSignal(signal);

    if (error) return rejectWithValue(error.message);

    return data;
  },
);

export default getItemsInfo;

import { createAsyncThunk } from "@reduxjs/toolkit";
// import type { Tproduct } from "../../types/product";
import type { RootState } from "../store";
import { supabase } from "../../services/supabase";

type TDataType = "productsFullInfo" | "productsIds";
// type TResponse = Tproduct[];

const actGetLikedProducts = createAsyncThunk(
  "wishList/getLikedProducts",
  async (dataType: TDataType, thunAPI) => {
    const { rejectWithValue, getState, signal } = thunAPI;
    const { auth } = getState() as RootState;
    const userId = auth.user?.id;

    const { data: wishlistRows, error: wishError } = await supabase
      .from("wishlist")
      .select("product_id")
      .eq("user_id", userId)
      .abortSignal(signal);

    if (wishError) return rejectWithValue(wishError.message);
    if (!wishlistRows?.length) return { data: [], dataType: "empty" };

    const productIds = wishlistRows.map((r) => r.product_id);

    if (dataType === "productsIds") {
      return { data: productIds, dataType: "productsIds" };
    }
    // else
    const { data: products, error: prodError } = await supabase
      .from("products")
      .select("*")
      .in("id", productIds);

    if (prodError) return rejectWithValue(prodError.message);
    return { data: products, dataType: "productsFullInfo" };
  },
);

export default actGetLikedProducts;

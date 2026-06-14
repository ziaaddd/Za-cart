import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { supabase } from "../../services/supabase";

const actLikeToogle = createAsyncThunk(
  "wishList/actLikeToogle",
  async (productId: number, thunAPI) => {
    const { rejectWithValue, getState } = thunAPI;
    const { auth, wishlist } = getState() as RootState;
    const userId = auth.user?.id;
    const isLiked = wishlist.likedProductsIds.includes(productId);

    if (isLiked) {
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("user_id", userId)
        .eq("product_id", productId);

      if (error) return rejectWithValue(error.message);
      return { type: "remove", productId };
    } else {
      const { error } = await supabase
        .from("wishlist")
        .insert({ user_id: userId, product_id: productId });

      if (error) return rejectWithValue(error.message);
      return { type: "add", productId };
    }
  },
);

export default actLikeToogle;

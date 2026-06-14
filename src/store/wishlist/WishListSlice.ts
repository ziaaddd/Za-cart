import { createSlice } from "@reduxjs/toolkit";
import actLikeToogle from "./actLikeToggle";
import type { Tproduct } from "../../types/product";
import type { Tloading } from "../../types/shared";
import actGetLikedProducts from "./actGetLikedProducts";
import { logOut } from "../auth/AuthSlice";

interface IwishList {
  likedProductsIds: number[];
  likedProductsFullInfo: Tproduct[];
  status: Tloading;
  error: null | string;
}

const initState: IwishList = {
  likedProductsIds: [],
  likedProductsFullInfo: [],
  status: "idle",
  error: null,
};

const whisListSlice = createSlice({
  name: "wishlist",
  initialState: initState,
  reducers: {
    wishListCleanUp: (state) => {
      state.likedProductsFullInfo = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(actLikeToogle.pending, (state) => {
      state.error = null;
    });
    builder.addCase(actLikeToogle.fulfilled, (state, action) => {
      if (action.payload.type == "add") {
        state.likedProductsIds.push(action.payload.productId);
      } else {
        state.likedProductsIds = state.likedProductsIds.filter(
          (el) => el !== action.payload.productId,
        );
        state.likedProductsFullInfo = state.likedProductsFullInfo.filter(
          (el) => el.id !== action.payload.productId,
        );
      }
    });
    builder.addCase(actLikeToogle.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // get liked products info
    builder.addCase(actGetLikedProducts.pending, (state) => {
      state.status = "pending";
      state.error = null;
    });
    builder.addCase(actGetLikedProducts.fulfilled, (state, action) => {
      state.status = "succeeded";
      if (action.payload.dataType === "productsFullInfo") {
        state.likedProductsFullInfo = action.payload.data as Tproduct[];
      } else if (action.payload.dataType === "productsIds") {
        state.likedProductsIds = action.payload.data as number[];
      }
    });
    builder.addCase(actGetLikedProducts.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });

    // when logout reset
    builder.addCase(logOut, (state) => {
      state.likedProductsIds = [];
      state.likedProductsFullInfo = [];
    });
  },
});

export const { wishListCleanUp } = whisListSlice.actions;
export default whisListSlice.reducer;

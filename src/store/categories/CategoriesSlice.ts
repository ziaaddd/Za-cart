import { createSlice } from "@reduxjs/toolkit";
import fetchCategories from "./actCategories";
import type { Tcategory } from "../../types/category";
import type { Tloading } from "../../types/shared";

interface IinitState {
  categories: Tcategory[];
  status: Tloading;
  error: null | string;
}

const initState: IinitState = {
  categories: [],
  status: "idle",
  error: null,
};

const CategoriesSlice = createSlice({
  name: "categories",
  initialState: initState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.pending, (state) => {
      state.status = "pending";
      state.error = null;
    });
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.categories = action.payload;
    });
    builder.addCase(fetchCategories.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });
  },
});

export default CategoriesSlice.reducer;

import { createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// import type { Tcategory } from "../../types/category";
import { supabase } from "../../services/supabase";

// type TResponse = Tcategory[];

const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    if (error) return rejectWithValue(error.message || "An unexpected error");
    return data;
  },
);

export default fetchCategories;

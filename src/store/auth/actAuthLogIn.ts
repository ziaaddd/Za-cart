import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../services/supabase";

interface IuserData {
  email: string;
  password: string;
}
export const actAuthLogIn = createAsyncThunk(
  "auth/login",
  async (userData: IuserData, thunAPI) => {
    const { rejectWithValue } = thunAPI;

    const { data, error } = await supabase.auth.signInWithPassword({
      email: userData.email,
      password: userData.password,
    });

    if (error)
      return rejectWithValue(error.message || "Invalid email or password");
    return data.user;
  },
);
// get session
export const actGetSession = createAsyncThunk(
  "auth/getSession",
  async (_, { rejectWithValue }) => {
    const { data, error } = await supabase.auth.getSession();
    if (error) return rejectWithValue(error.message);
    return data.session?.user ?? null;
  },
);

export const actAuthGoogle = createAsyncThunk(
  "auth/google",
  async (_, { rejectWithValue }) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) return rejectWithValue(error.message);
  },
);

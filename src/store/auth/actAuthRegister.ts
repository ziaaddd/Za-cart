import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../services/supabase";

interface IuserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
const actAuthRegister = createAsyncThunk(
  "auth/register",
  async (userData: IuserData, thunAPI) => {
    const { rejectWithValue } = thunAPI;

    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: { firstName: userData.firstName, lastName: userData.lastName },
      },
    });
    if (error) return rejectWithValue(error.message);
    if (data.user && data.user.identities?.length === 0) {
      return rejectWithValue(
        "This email is already registered. Try logging in instead.",
      );
    }
    return data.user;
  },
);

export default actAuthRegister;

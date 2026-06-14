import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../services/supabase";

export interface TupdateProfile {
  firstName?: string;
  lastName?: string;
  newPassword?: string;
}

// Updates the Supabase auth user's metadata (name) and/or password.
// supabase.auth.updateUser() updates the currently signed-in user —
// no need to pass the user ID manually, Supabase reads it from the session.
const actUpdateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (payload: TupdateProfile, { rejectWithValue }) => {
    // this top get the type of parameter that updateUser Fun accept
    const updateData: Parameters<typeof supabase.auth.updateUser>[0] = {};

    // Only send fields that were actually changed
    if (payload.firstName || payload.lastName) {
      updateData.data = {
        firstName: payload.firstName,
        lastName: payload.lastName,
      };
    }

    if (payload.newPassword) {
      updateData.password = payload.newPassword;
    }

    const { data, error } = await supabase.auth.updateUser(updateData);
    if (error) return rejectWithValue(error.message);
    return data.user;
  },
);

export default actUpdateProfile;

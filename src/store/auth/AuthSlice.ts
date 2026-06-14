import { createSlice } from "@reduxjs/toolkit";
import type { Tloading } from "../../types/shared";
import actAuthRegister from "./actAuthRegister";
import { actAuthLogIn, actGetSession } from "./actAuthLogIn";
import actUpdateProfile from "./actUpdateProfile";
import { supabase } from "../../services/supabase";

interface Iauth {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  token: string | null;

  status: Tloading;
  error: null | string;
  updateStatus: Tloading;
  updateError: null | string;
}

const initialState: Iauth = {
  user: null,
  token: null,
  status: "idle",
  error: null,
  updateStatus: "idle",
  updateError: null,
};
const registerSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    cleanUser(state) {
      state.error = null;
      state.status = "idle";
    },
    logOut(state) {
      supabase.auth.signOut();
      state.user = null;
      state.token = null;
    },
    resetUpdateStatus(state) {
      state.updateStatus = "idle";
      state.updateError = null;
    },
  },
  //register
  extraReducers: (builder) => {
    builder.addCase(actAuthRegister.pending, (state) => {
      state.status = "pending";
      state.error = null;
    });
    builder.addCase(actAuthRegister.fulfilled, (state, action) => {
      state.status = "succeeded";
      const u = action.payload;
      state.user = {
        id: u!.id,
        firstName: u!.user_metadata?.firstName ?? "",
        lastName: u!.user_metadata?.lastName ?? "",
        email: u!.email ?? "",
      };
      state.token = u!.id; // Supabase handles the real JWT internally
    });
    builder.addCase(actAuthRegister.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });

    //loging In

    builder.addCase(actAuthLogIn.pending, (state) => {
      state.status = "pending";
      state.error = null;
    });
    builder.addCase(actAuthLogIn.fulfilled, (state, action) => {
      state.status = "succeeded";
      const u = action.payload;
      state.user = {
        id: u!.id,
        firstName: u!.user_metadata?.firstName ?? "",
        lastName: u!.user_metadata?.lastName ?? "",
        email: u!.email ?? "",
      };
      state.token = u!.id;
    });
    builder.addCase(actAuthLogIn.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });

    // get session
    builder.addCase(actGetSession.fulfilled, (state, action) => {
      const u = action.payload;
      if (!u) return;
      state.user = {
        id: u!.id,
        firstName: u!.user_metadata?.firstName ?? "",
        lastName: u!.user_metadata?.lastName ?? "",
        email: u!.email ?? "",
      };
      state.token = u!.id;
    });

    //updtae user profile
    builder.addCase(actUpdateProfile.pending, (state) => {
      state.updateStatus = "pending";
      state.updateError = null;
    });
    builder.addCase(actUpdateProfile.fulfilled, (state, action) => {
      state.updateStatus = "succeeded";
      if (action.payload && state.user) {
        state.user.firstName =
          action.payload.user_metadata?.firstName ?? state.user.firstName;
        state.user.lastName =
          action.payload.user_metadata?.lastName ?? state.user.lastName;
      }
    });
    builder.addCase(actUpdateProfile.rejected, (state, action) => {
      state.updateStatus = "failed";
      state.updateError = action.payload as string;
    });
  },
});

export default registerSlice.reducer;
export const { cleanUser, logOut, resetUpdateStatus } = registerSlice.actions;

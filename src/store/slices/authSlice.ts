
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type {
  AuthState,
  AuthUser,
  AuthLoginMethod,
} from "@/types/auth.types";

type MfaDetails = {
  loginMethods: AuthLoginMethod[];
  backupCodesRemaining: number;
  totpFactorId: number | null;
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,

  loginMethods: [],
  backupCodesRemaining: 0,
  totpFactorId: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    },

    restoreUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    },

    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    updateMfaDetails: (
      state,
      action: PayloadAction<Partial<MfaDetails>>,
    ) => {
      if (action.payload.loginMethods !== undefined) {
        state.loginMethods = action.payload.loginMethods;
      }

      if (action.payload.backupCodesRemaining !== undefined) {
        state.backupCodesRemaining =
          action.payload.backupCodesRemaining;
      }

      if (action.payload.totpFactorId !== undefined) {
        state.totpFactorId = action.payload.totpFactorId;
      }
    },

    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;

      state.loginMethods = [];
      state.backupCodesRemaining = 0;
      state.totpFactorId = null;
    },
  },
});

export const {
  setUser,
  restoreUser,
  setAuthLoading,
  updateMfaDetails,
  clearAuth,
} = authSlice.actions;

export default authSlice.reducer;

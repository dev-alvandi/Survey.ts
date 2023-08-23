import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface UserSchemaTypes {
  name?: string;
  email?: string;
  likedPosts?: [];
  userId: string;
  isAuth: boolean;
  authToken: string;
}

interface UserState {
  user: UserSchemaTypes;
  resetToken: string;
}

const initialState: UserState = {
  user: {
    isAuth: false,
    authToken: '',
    userId: '',
  },
  resetToken: '',
};

export const ResetTokenSlice = createSlice({
  name: 'resetToken',
  initialState,
  reducers: {
    addResetToken: (state, action: PayloadAction<string>) => {
      state.resetToken = action.payload;
    },
  },
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    toAuth: (state, action: PayloadAction<UserSchemaTypes>) => {
      state.user = action.payload;
    },
    unAuth: (state) => {
      state.user = initialState.user;
    },
  },
});

export const resetTokenReducer = ResetTokenSlice.reducer;
export const { addResetToken } = ResetTokenSlice.actions;

export const authReducer = authSlice.reducer;
export const { toAuth, unAuth } = authSlice.actions;

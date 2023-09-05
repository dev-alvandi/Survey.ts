import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_API_URL } from '../utils/api';
export interface UserSchemaTypes {
  _id: string;
  name: string;
  email: string;
  likedPosts: string[];
  myPosts: string[];
  likedComments: string[];
  avatar: string;
}

const resetUser = {
  _id: '',
  name: '',
  email: '',
  likedPosts: [],
  myPosts: [],
  likedComments: [],
  avatar: '',
};

interface UserState {
  user: UserSchemaTypes;
  isAuth: boolean;
  resetToken: string;
}

const initialState: UserState = {
  user: resetUser,
  isAuth: false,
  resetToken: '',
};

export const fetchUserById = createAsyncThunk(
  'user/FetchById',
  async (userId: string) => {
    try {
      const config = {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      };
      const response = await axios.get(
        `${BASE_API_URL}/auth/get-user/${userId}`,
        config
      );
      if (response.status === 200) {
        // console.log(response.data.user.avatar);
        return response.data.user;
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const ResetTokenSlice = createSlice({
  name: 'resetToken',
  initialState,
  reducers: {
    addResetToken: (state, action: PayloadAction<string>) => {
      state.resetToken = action.payload;
    },
  },
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = resetUser;
      state.isAuth = false;
      localStorage.removeItem('token');
      localStorage.removeItem('expiryDate');
      localStorage.removeItem('userId');
    },
    login: (
      state,
      action: PayloadAction<{ user: UserSchemaTypes; isAuth: boolean }>
    ) => {
      state.isAuth = action.payload.isAuth;
      state.user = action.payload.user;
    },
    changeAvatar: (state, action) => {
      state.user = { ...state.user, avatar: action.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserById.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isAuth = true;
    });
  },
});

export const resetTokenReducer = ResetTokenSlice.reducer;
export const { addResetToken } = ResetTokenSlice.actions;

export const userReducer = userSlice.reducer;
export const { logout, login, changeAvatar } = userSlice.actions;

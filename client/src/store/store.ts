import { configureStore } from '@reduxjs/toolkit';
import { ResetTokenSlice, authSlice } from './userSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { editPostHandler } from './postSlice';

export const store = configureStore({
  reducer: {
    resetToken: ResetTokenSlice.reducer,
    auth: authSlice.reducer,
    editPost: editPostHandler.reducer,
  },
});

export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = useSelector;

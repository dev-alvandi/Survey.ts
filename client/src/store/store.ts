import { configureStore } from '@reduxjs/toolkit';
import { resetTokenReducer, userReducer } from './userSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { editPostHandler } from './postSlice';
import { editCommentHandler } from './commentSlice';

export const store = configureStore({
  reducer: {
    resetToken: resetTokenReducer,
    user: userReducer,
    editPost: editPostHandler.reducer,
    editComment: editCommentHandler.reducer,
  },
});

export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = useSelector;

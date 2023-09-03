import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { UserSchemaTypes } from './userSlice';

export interface CommentSchemaTypes {
  _id: string;
  text: string;
  creator?: {};
  relatedPost: string;
  likes: string[];
  created_at?: Date;
  updated_at?: Date;
}

interface PostStateTypes {
  myComment: CommentSchemaTypes;
  isEditing: boolean;
}

export const resetCommentValue = {
  _id: '',
  text: '',
  creator: {},
  relatedPost: '',
  likes: [],
};

const initialState: PostStateTypes = {
  myComment: { ...resetCommentValue },
  isEditing: false,
};

export const editCommentHandler = createSlice({
  name: 'editComment',
  initialState,
  reducers: {
    editComment: (
      state,
      action: PayloadAction<{ comment: CommentSchemaTypes; isEditing: boolean }>
    ) => {
      state.myComment = action.payload.comment;
      state.isEditing = action.payload.isEditing;
    },
  },
});

export const editPostReducer = editCommentHandler.reducer;
export const { editComment } = editCommentHandler.actions;

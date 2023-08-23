import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface PostSchemaTypes {
  _id: string;
  title: string;
  imageUrl: string;
  caption: string;
  isLiked: boolean;
  creator: {
    _id: string;
    name: string;
    avatar?: string;
  };
  likes: number[];
  comments?: {
    commentId: string;
    avatar: string;
    commentator: string;
    text: string;
    updated_at: Date;
    created_at: Date;
  }[];
  updated_at?: Date;
  created_at?: Date;
}

interface PostStateTypes {
  post: PostSchemaTypes;
  isEditing: boolean;
}

export const resetPostValue = {
  _id: '',
  title: '',
  caption: '',
  imageUrl: '',
  isLiked: false,
  creator: {
    _id: '',
    name: '',
  },
  likes: [],
};

const initialState: PostStateTypes = {
  post: { ...resetPostValue },
  isEditing: false,
};

export const editPostHandler = createSlice({
  name: 'editPost',
  initialState,
  reducers: {
    editPost: (
      state,
      action: PayloadAction<{ post: PostSchemaTypes; isEditing: boolean }>
    ) => {
      state.post = action.payload.post;
      state.isEditing = action.payload.isEditing;
    },
  },
});

export const editPostReducer = editPostHandler.reducer;
export const { editPost } = editPostHandler.actions;

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

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
  editing: { status: boolean; commentId?: string; text?: string };
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
  editing: { status: false },
};

const authenticationConfig = {
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token'),
  },
};

export const editCommentAction = createAsyncThunk(
  'comment/editComment',
  async ({
    method,
    url,
    comment,
  }: {
    method: string;
    url: string;
    comment: string;
  }) => {
    try {
      const response = await axios({
        method: method,
        url: url,
        data: { comment: comment },
        headers: authenticationConfig.headers,
      });
      if (response.status === 200) {
        return response.data.newComment;
      }
    } catch (err) {
      console.log(err);
    }
  }
);

export const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    isEditingHandler: (state, action) => {
      state.editing.status = action.payload.status;
      state.editing.commentId = action.payload.commentId;
      state.editing.text = action.payload.text;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(editCommentAction.fulfilled, (state, action) => {
      state.myComment = action.payload;
    });
  },
});

export const commentReducer = commentSlice.reducer;
export const { isEditingHandler } = commentSlice.actions;

import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_API_URL } from '../utils/api';

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
  fetchingStatus: { msg: string; status: number | null };
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
  fetchingStatus: { msg: '', status: null },
};

const authenticationConfig = {
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token'),
  },
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface errReponse {
  data: { msg: string };
  status: number;
}

export const createComment = createAsyncThunk(
  'comment/createComment',
  async ({ comment, postId }: { comment: string; postId: string }) => {
    try {
      const response = await axios({
        method: 'POST',
        url: `${BASE_API_URL}/feed/new-comment/${postId}`,
        data: { comment: comment },
        headers: authenticationConfig.headers,
      });
      if (response.status === 200) {
        return {
          data: response.data.newComment,
          msg: response.data.msg,
          status: response.status,
        };
      }
    } catch (err: any | { response: errReponse }) {
      return {
        msg: err.response.data.msg,
        status: err.response.status,
      };
    }
  }
);

export const editComment = createAsyncThunk(
  'comment/editComment',
  async ({
    oldCommentId,
    newComment,
  }: {
    oldCommentId: string;
    newComment: string;
  }) => {
    try {
      const response = await axios({
        method: 'Put',
        url: `${BASE_API_URL}/feed/edit-comment/${oldCommentId}`,
        data: { comment: newComment },
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
    resetFetchingStatus: (state, action) => {
      state.fetchingStatus.msg = '';
      state.fetchingStatus.status = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(editComment.fulfilled, (state, action) => {
      state.myComment = action.payload;
    });
    builder
      .addCase(createComment.fulfilled, (state, action) => {
        state.fetchingStatus.msg = action.payload?.msg;
        state.fetchingStatus.status = action.payload?.status!;
      })
      .addCase(createComment.rejected, (state, action: PayloadAction<any>) => {
        state.fetchingStatus.msg = action.payload?.msg;
        state.fetchingStatus.status = action.payload?.status!;
      });
  },
});

export const commentReducer = commentSlice.reducer;
export const { isEditingHandler, resetFetchingStatus } = commentSlice.actions;

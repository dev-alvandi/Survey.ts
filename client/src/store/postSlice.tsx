import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_API_URL } from '../utils/api';

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
  likes: string[];
  comments: {
    _id: string;
    relatedPost: string;
    likes: [];
    creator: {};
    text: string;
    updated_at: Date;
    created_at: Date;
  }[];
  updated_at?: Date;
  created_at?: Date;
}

interface PostStateTypes {
  allPosts: PostSchemaTypes[];
  myPost: PostSchemaTypes[];
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
  comments: [],
  likes: [],
};

const initialState: PostStateTypes = {
  allPosts: [],
  myPost: [],
  post: { ...resetPostValue },
  isEditing: false,
};

const getAllPosts = createAsyncThunk('posts/getAllPosts', (page) => {
  axios
    .get(`${BASE_API_URL}/feed/receive-posts/?page=${page}`)
    .then((res) => {
      if (res.status === 200 || res.status === 201) {
        return res.data.posts;
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

const getMyOwnPosts = createAsyncThunk(
  'posts/getMyOwnPosts',
  ({
    page,
    userId,
    authHeaders,
  }: {
    page: number;
    userId: string;
    authHeaders: {};
  }) => {
    axios
      .get(
        `${BASE_API_URL}/feed/receive-posts/?page=${page}&userId=${userId}`,
        authHeaders
      )
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          return res.data.posts;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
);

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
  extraReducers: (builder) => {
    builder.addCase(
      getAllPosts.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.allPosts.push(...action.payload);
      }
    );
    builder.addCase(
      getMyOwnPosts.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.myPost.push(...action.payload);
      }
    );
  },
});

export const editPostReducer = editPostHandler.reducer;
export const { editPost } = editPostHandler.actions;

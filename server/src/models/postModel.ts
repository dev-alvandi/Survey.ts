import { Schema, Types, model } from 'mongoose';

export interface PostType {
  _id: Types.ObjectId;
  title: string;
  caption: string;
  imageUrl: string;
  creator: Types.ObjectId;
  likes: string[];
  comments: Types.ObjectId[];
}

const postSchema = new Schema<PostType>(
  {
    title: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: String,
        required: true,
        default: 0,
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        required: true,
      },
    ],
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

export default model('Post', postSchema);

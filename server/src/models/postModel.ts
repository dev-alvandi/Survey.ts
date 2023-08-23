import { Schema, Types, model } from 'mongoose';

export interface PostType {
  _id: Types.ObjectId;
  title: string;
  caption: string;
  imageUrl: string;
  creator: Types.ObjectId;
  likes: string[];
  comments?: {
    userId: Types.ObjectId;
    commentedAt: Date;
    editedAt: Date;
  }[];
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
    comments: {
      type: [
        {
          userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
          },
          text: {
            type: String,
            required: true,
          },
          updated_at: {
            type: Date,
            required: true,
          },
          created_at: {
            type: Date,
            required: true,
          },
        },
      ],
      required: false,
    },
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

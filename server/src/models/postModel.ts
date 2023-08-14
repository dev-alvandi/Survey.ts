import { Schema, Types, model } from 'mongoose';

export interface PostType {
  _id: Types.ObjectId;
  title: string;
  caption: string;
  imageUrl: string;
  creator: {
    userId: Types.ObjectId;
    name: string;
  };
  likes?: number;
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
    likes: {
      type: Number,
    },
    comments: {
      type: [
        {
          userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
          },
          commentedAt: {
            type: Date,
            required: true,
          },
          editedAt: {
            type: Date,
            required: true,
          },
        },
      ],
      required: false,
    },
    creator: {
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      name: {
        type: String,
        required: true,
      },
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

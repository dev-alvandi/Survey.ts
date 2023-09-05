import { Schema, Types, model } from 'mongoose';

export interface CommentType {
  _id: Types.ObjectId;
  text: string;
  creator: Types.ObjectId;
  relatedPost: Types.ObjectId;
  likes: string[];
}

const commentSchema = new Schema<CommentType>(
  {
    text: {
      type: String,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    relatedPost: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likes: [
      {
        type: String,
        required: true,
      },
    ],
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

export default model('Comment', commentSchema);

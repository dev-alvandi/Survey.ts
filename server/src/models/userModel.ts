import { Schema, Types, model } from 'mongoose';

export interface UserType {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  resetToken?: string;
  resetTokenExpiration?: Date;
  likedPosts?: { postId: Types.ObjectId }[];
}

const userSchema = new Schema<UserType>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExpiration: Date,
  likedPosts: [
    {
      postId: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
      },
    },
  ],
});

export default model('User', userSchema);

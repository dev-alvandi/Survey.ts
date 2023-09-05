import { Schema, Types, model } from 'mongoose';
import { PostType } from './postModel';

export interface UserType {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  avatar: string;
  resetToken?: string;
  resetTokenExpiration?: Date;
  likedPosts?: Types.ObjectId[];
  likedComments?: Types.ObjectId[];
  myPosts: Types.ObjectId[];
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
  avatar: {
    type: String,
  },
  resetToken: String,
  resetTokenExpiration: Date,
  likedPosts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
  likedComments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
  myPosts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
});

userSchema.methods.toJSON = function () {
  const copyObj = this.toObject();
  if (copyObj.password) {
    delete copyObj.password;
  }
  return copyObj;
};

export default model('User', userSchema);

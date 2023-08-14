import { RequestHandler } from 'express';
import { Types } from 'mongoose';
import { validationResult } from 'express-validator';
import Post from '../models/postModel';
import User from '../models/userModel';

export const getPosts: RequestHandler = (req, res, next) => {
  const currPage: number = +req.query.page! || 1;
  const perPage = 5;
  let totalItems;
  Post.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Post.find()
        .skip((currPage - 1) * perPage)
        .limit(perPage);
    })
    .then((posts) => {
      res.status(200).json({
        msg: 'Fetched posts successfully.',
        posts: [...posts],
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export const getPost: RequestHandler = (req, res, next) => {
  const { postId } = req.params;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error: any = new Error('No post with this credential was found!');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ msg: 'Post fetched successfully!', post: post });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export const CreatePost: RequestHandler = (req, res, next) => {
  // console.log(req.body);
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const error: any = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = validationErrors.array();
    throw error;
  }
  if (!req.body.imageUrl) {
    const error: any = new Error('File upload invalid');
    error.statusCode = 422;
    error.data = [{ msg: 'No image is provided.' }];
    throw error;
  }
  const { title, caption, creatorId, imageUrl } = req.body;
  // const imageUrl = req.file.path;
  User.findById(creatorId)
    .then((user) => {
      if (!user) {
        const error: any = new Error(
          'No user with the sent credentials was found!'
        );
        error.statusCode = 422;
        error.data = validationErrors.array();
        throw error;
      }

      const newPost = new Post({
        title: title,
        imageUrl: imageUrl, //! will be fixed later
        caption: caption,
        creator: {
          userId: user._id,
          name: user.name,
        },
      });
      return newPost.save();
    })
    .then((newPost) => {
      res.status(201).json({
        msg: 'Post created successfully.',
        post: newPost,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

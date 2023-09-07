import { NextFunction, RequestHandler, Response } from 'express';
import { Types } from 'mongoose';
import { validationResult } from 'express-validator';

import Socket from '../socket';
import Post, { PostType } from '../models/postModel';
import User, { UserType } from '../models/userModel';
import { clearImage } from '../utils/clearImageHandler';
import customError from '../utils/customError';

export const getPosts: RequestHandler = (req: any, res, next) => {
  const { userId } = req.query;
  const currPage: number = +req.query.page! || 1;
  const perPage = 5;
  let totalItems;
  let loadedPosts: PostType[] = [];
  return Post.find()

    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Post.find()
        .populate('creator')
        .skip((currPage - 1) * perPage)
        .limit(perPage);
    })
    .then((posts): any => {
      loadedPosts = posts;
      if (!userId) {
        return res.status(200).json({
          msg: 'Fetched posts successfully.',
          posts: [...posts],
          isUser: false,
        });
      }
      return User.findById(req.userId).populate({
        path: 'myPosts',
        populate: { path: 'creator' },
      });
    })
    .then((user) => {
      if (userId) {
        if (!user) {
          return res.status(422).json({
            msg: 'User not found.',
            isUser: false,
          });
        }

        const updatedPosts = loadedPosts.map((post) => {
          let loadedCreator: UserType;
          const isLiked = user.likedPosts!.find(
            (likedPost: Types.ObjectId) =>
              likedPost.toString() === post._id.toString()
          );
          const newPost = {
            // @ts-ignore
            ...post.toObject(),
            isLiked: isLiked ? true : false,
            // @ts-ignore
            creator: post.toObject().creator,
          };

          return newPost;
        });

        return res.status(200).json({
          msg: 'Fetched posts successfully.',
          posts: [...updatedPosts],
          isUser: true,
        });
      }
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export const getMyPosts: RequestHandler = (req: any, res, next) => {
  const { userId, page } = req.query;
  const currPage: number = +page! || 1;
  const perPage = 5;
  let totalItems;
  let loadedPosts: PostType[] = [];
  return Post.find({ creator: new Types.ObjectId(userId) })
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Post.find({ creator: new Types.ObjectId(userId) })
        .populate('creator')
        .skip((currPage - 1) * perPage)
        .limit(perPage);
    })
    .then((posts): any => {
      loadedPosts = posts;
      if (!userId) {
        throw customError('User id not found', 422);
      }
      return User.findById(req.userId).populate({
        path: 'myPosts',
        populate: { path: 'creator' },
      });
    })
    .then((user) => {
      if (userId) {
        if (!user) {
          return res.status(422).json({
            msg: 'User not found.',
            isUser: false,
          });
        }
        const updatedPosts = loadedPosts.map((post) => {
          let loadedCreator: UserType;
          const isLiked = user.likedPosts!.find(
            (likedPost: Types.ObjectId) =>
              likedPost.toString() === post._id.toString()
          );
          const newPost = {
            // @ts-ignore
            ...post.toObject(),
            isLiked: isLiked ? true : false,
            // @ts-ignore
            creator: post.toObject().creator,
          };

          return newPost;
        });

        return res.status(200).json({
          msg: 'Fetched posts successfully.',
          posts: [...updatedPosts],
          isUser: true,
        });
      }
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
    .populate('creator')
    .populate({ path: 'comments', populate: { path: 'creator' } })
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

export const CreatePost: RequestHandler = (req: any, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const error: any = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = validationErrors.array();
    throw error;
  }

  if (!req.files) {
    const error: any = new Error('File upload invalid');
    error.statusCode = 422;
    error.data = [{ msg: 'No image is provided.' }];
    throw error;
  }

  const { title, caption } = req.body;
  const splittedImageUrl = req.files.image[0].path.split('/');
  const imageUrl = 'images/' + splittedImageUrl[splittedImageUrl.length - 1];

  let creator: UserType;
  const newPost = new Post({
    title: title,
    imageUrl: imageUrl,
    caption: caption,
    creator: req.userId,
  });
  newPost
    .save()
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      if (!user) {
        const error: any = new Error('User not found!');
        error.statusCode = 422;
        throw error;
      }
      creator = user;
      user.myPosts.push(newPost._id);
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        msg: 'Post created successfully.',
        post: newPost,
        creator: { _id: creator._id, name: creator.name },
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export const likePost: RequestHandler = (req, res, next) => {
  const { postId } = req.query;
  const { userId, isLiked } = req.body;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error: any = new Error(
          'No user with the sent credentials was found!'
        );
        error.statusCode = 422;
        error.data = [{ msg: 'User is not found.' }];
        throw error;
      }

      return Post.findById(postId);
    })
    .then(async (loadedPost) => {
      if (!loadedPost) {
        const error: any = new Error('Post is not sent!');
        error.statusCode = 422;
        error.data = [{ msg: 'User is not found.' }];
        throw error;
      }

      const hasAlreadyLikedIndex = loadedPost.likes.findIndex(
        (userIdWhoLikedPost) => userIdWhoLikedPost === userId
      );

      if (isLiked && hasAlreadyLikedIndex === -1) {
        await User.findByIdAndUpdate(userId, { $push: { likedPosts: postId } });
        return Post.findByIdAndUpdate(
          postId,
          { $push: { likes: userId } },
          { new: true }
        );
      } else if (!isLiked && hasAlreadyLikedIndex > -1) {
        await User.findByIdAndUpdate(userId, { $pull: { likedPosts: postId } });
        return Post.findByIdAndUpdate(
          postId,
          { $pull: { likes: userId } },
          { new: true }
        );
      }
    })
    .then((updatedPost) => {
      if (!updatedPost) {
        throw customError('Post cannot get updated at the moment!', 422);
      }

      res.status(201).json({
        msg: `Post is ${isLiked ? 'liked' : 'unliked'} successfully.`,
        likes: updatedPost.likes.length,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export const editPost: RequestHandler = (req: any, res, next) => {
  //* Validation Check
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    throw customError(
      'Validation failed.',
      422,
      validationErrors.array().map((errObject) => errObject.msg)
    );
  }

  const { postId } = req.params;
  const { title, caption } = req.body;

  let imageUrl = req.body.image;

  if (req.files) {
    imageUrl = req.files.image[0].path;
  }

  if (!imageUrl) {
    throw customError('No image has been picked!', 422);
  }

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        throw customError(
          'No post with the sent credentials was found!',
          422,
          validationErrors.array().map((errObject) => errObject.msg)
        );
      }

      if (post.creator.toString() !== req.userId) {
        throw customError(
          'User is not authorized!',
          403,
          validationErrors.array().map((errObject) => errObject.msg)
        );
      }

      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);

        const splittedImageUrl = imageUrl.split('/');

        post.imageUrl =
          'images/' + splittedImageUrl[splittedImageUrl.length - 1];
      }
      post.title = title;
      post.caption = caption;
      return post.save();
    })
    .then((result) => {
      res.status(200).json({ msg: 'Post is updated', post: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export const deletePost: RequestHandler = (req: any, res, next) => {
  const { postId } = req.params;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error: any = new Error(
          'No post with the sent credentials was found!'
        );
        error.statusCode = 422;
        throw error;
      }

      if (post.creator.toString() !== req.userId) {
        const error: any = new Error('User is not authorized!');
        error.statusCode = 422;
        throw error;
      }
      clearImage(post.imageUrl);
      return Post.findByIdAndRemove(postId);
    })
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      if (!user) {
        const error: any = new Error('User not found!');
        error.statusCode = 422;
        throw error;
      }
      // @ts-ignore
      user.myPosts.pull(postId);
      return user.save();
    })
    .then((result) => {
      res.status(200).json({ msg: 'Post deleted successfully!' });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

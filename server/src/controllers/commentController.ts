import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';

import Socket from '../socket';
import Post, { PostType } from '../models/postModel';
import User, { UserType } from '../models/userModel';
import Comment, { CommentType } from '../models/commentModel';
import customError from '../utils/customError';
import { createRequire } from 'module';

export const newComment: RequestHandler = (req: any, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const error: any = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = validationErrors.array();
    throw error;
  }

  const { postId } = req.params;
  const { comment } = req.body;

  const newComment = new Comment({
    creator: req.userId,
    relatedPost: postId,
    text: comment,
  });
  return newComment
    .save()
    .then((result) => {
      return Post.findById(postId);
    })
    .then((post) => {
      if (!post) {
        const error: any = new Error('Post not found!');
        error.statusCode = 422;
        throw error;
      }
      post.comments.push(newComment._id);

      return post.save();
    })
    .then((newPost) => {
      return newPost.populate({
        path: 'comments',
        populate: { path: 'creator' },
      });
    })
    .then((newPost) => newPost.populate('creator'))
    .then((populatednewPost) => {
      console.log(populatednewPost);
      Socket.getIO().emit('comments', {
        action: 'create',
        post: populatednewPost,
      });
      res.status(200).json({
        msg: 'Comment is registered successfully.',
        post: populatednewPost,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export const editComment: RequestHandler = async (req: any, res, next) => {
  const { commentId } = req.params;
  const { comment: text } = req.body;

  if (!commentId) {
    throw customError('Comment id is not provided for delete action.', 422);
  }

  let loadedComment: CommentType;
  Comment.findById(commentId)
    .then((comment) => {
      if (!comment) {
        throw customError('No comment with such an id was found! ', 422);
      }
      if (comment.creator.toString() !== req.userId.toString()) {
        throw customError(
          'User is not authorised to delete this comment! ',
          422
        );
      }
      if (comment.text === text) {
        res.status(304).json({ msg: 'Comment is not edited' });
      }
      comment.text = text;
      return comment.save();
    })
    .then((newComment) => {
      return Post.findById(newComment.relatedPost)
        .populate({
          path: 'comments',
          populate: { path: 'creator' },
        })
        .populate('creator');
    })
    .then((newPopulatedPost) => {
      console.log(newPopulatedPost);
      Socket.getIO().emit('comments', {
        action: 'edit',
        post: newPopulatedPost,
      });
      res.status(200).json({ msg: 'Comment edited successfully!' });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export const deleteComment: RequestHandler = async (req: any, res, next) => {
  const { commentId } = req.params;

  if (!commentId) {
    throw customError('Comment id is not provided for delete action.', 422);
  }
  let loadedComment: CommentType;
  Comment.findById(commentId)
    .then((comment) => {
      if (!comment) {
        throw customError('No comment with such an id was found! ', 422);
      }
      if (comment.creator.toString() !== req.userId.toString()) {
        throw customError(
          'User is not authorised to delete this comment! ',
          422
        );
      }
      loadedComment = comment;
      return Comment.findByIdAndRemove(commentId);
    })
    .then((result) => {
      return Post.findById(loadedComment.relatedPost);
    })
    .then((post) => {
      if (!post) {
        throw customError(
          'No post was found from which such comment could be deleted! ',
          422
        );
      }
      // @ts-ignore
      post.comments.pull(commentId);
      return post.save().then();
    })
    .then((newPost) => {
      return newPost.populate({
        path: 'comments',
        populate: { path: 'creator' },
      });
    })
    .then((newPost) => newPost.populate('creator'))
    .then((newPopulatedPost) => {
      Socket.getIO().emit('comments', {
        action: 'delete',
        post: newPopulatedPost,
      });
      res.status(200).json({ msg: 'Comment deleted successfully!' });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export const likeComment: RequestHandler = async (req: any, res, next) => {
  const { commentId } = req.query;
  const { userId, isLiked } = req.body;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw customError('No user with the sent credentials was found!', 422, [
          'User is not found.',
        ]);
      }

      return Comment.findById(commentId);
    })
    .then(async (loadedComment) => {
      if (!loadedComment) {
        throw customError('Comment is not found!', 422);
      }

      const hasAlreadyLikedIndex = loadedComment.likes.findIndex(
        (userIdWhoLikedPost) => userIdWhoLikedPost === userId
      );

      if (isLiked && hasAlreadyLikedIndex === -1) {
        // console.log('Liked');
        await User.findByIdAndUpdate(userId, {
          $push: { likedComments: commentId },
        });
        return Comment.findByIdAndUpdate(
          commentId,
          { $push: { likes: userId } },
          { new: true }
        );
      } else if (!isLiked && hasAlreadyLikedIndex > -1) {
        await User.findByIdAndUpdate(userId, {
          $pull: { likedComments: commentId },
        });
        return Comment.findByIdAndUpdate(
          commentId,
          { $pull: { likes: userId } },
          { new: true }
        );
      }
    })
    .then((updatedComment) => {
      console.log(isLiked);
      if (!updatedComment) {
        throw customError('Liking comment failed', 500);
      }
      // Socket.getIO().emit('comments', { //* For implementing liking comments in real-time.
      //   action: 'likedComment',
      //   post: updatedComment,
      // });
      res.status(201).json({
        msg: `Comment is ${isLiked ? 'liked' : 'unliked'} successfully.`,
        likes: updatedComment.likes.length,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

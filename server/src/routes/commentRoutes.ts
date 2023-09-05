import { Router } from 'express';
import {
  deleteComment,
  newComment,
  likeComment,
  editComment,
} from '../controllers/commentController';
import isAuth from '../middleware/isAuth';
import { body } from 'express-validator';

const router = Router();

router.post(
  '/new-comment/:postId',
  isAuth,
  [
    body(
      'comment',
      'Please write a comment shorter than 280 characters.'
    ).isLength({ min: 1, max: 280 }),
  ],
  newComment
);

router.put('/like-comment', isAuth, likeComment);

router.put('/edit-comment/:commentId', isAuth, editComment);

router.delete('/delete-comment/:commentId', isAuth, deleteComment);

export default router;

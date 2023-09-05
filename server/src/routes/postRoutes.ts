import { Router } from 'express';
import { body } from 'express-validator';

import {
  getPosts,
  CreatePost,
  getPost,
  likePost,
  editPost,
  deletePost,
  getMyPosts,
} from '../controllers/postController';
import isAuth from '../middleware/isAuth';

const router = Router();

router.get('/receive-posts/', getPosts);

router.get('/receive-myPosts/', isAuth, getMyPosts);

router.get('/receive-post/:postId', getPost);

router.post(
  '/create-post',
  isAuth,
  [
    body('title', 'Please write a title longer than 5 characters..').isLength({
      min: 5,
    }),
    body(
      'caption',
      'Please write a caption longer than 5 characters.'
    ).isLength({ min: 5 }),
  ],
  CreatePost
);

router.put('/like-post', isAuth, likePost);

router.put(
  '/edit-post/:postId',
  isAuth,
  [
    body('title', 'Please write a title longer than 5 characters.').isLength({
      min: 5,
    }),
    body(
      'caption',
      'Please write a caption longer than 5 characters.'
    ).isLength({ min: 5 }),
  ],
  editPost
);

router.delete('/delete-post/:postId', isAuth, deletePost);

export default router;

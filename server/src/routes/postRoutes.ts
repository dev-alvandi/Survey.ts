import { Router } from 'express';
import { body } from 'express-validator';

import { getPosts, CreatePost, getPost } from '../controllers/postController';

const router = Router();

router.get('/receive-posts', getPosts);

router.get('/receive-post/:postId', getPost);

router.post(
  '/create-post',
  [
    body('title', 'Please write a correct Title.').isAlphanumeric('sv-SE', {
      ignore: ' ',
    }),
    body(
      'caption',
      'Please write a caption longer than 5 characters.'
    ).isLength({ min: 5 }),
  ],
  CreatePost
);

export default router;

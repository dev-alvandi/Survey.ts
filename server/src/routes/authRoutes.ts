import { Router } from 'express';
import { body } from 'express-validator';

import User from '../models/userModel';
import {
  register,
  setAvatar,
  login,
  forgottenPassword,
  newPassword,
  getUser,
} from '../controllers/authControllers';
import isAuth from '../middleware/isAuth';

const router = Router();
// Post routes
router.put(
  '/register',
  [
    body('name', 'Please enter a valid name!')
      .trim()
      .isLength({ min: 3 })
      .withMessage('Please enter a name longer than 3 character!')
      .isAlpha('sv-SE', { ignore: ' ' })
      .withMessage('Please enter a valid name!'),
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please enter a valid email!')
      .normalizeEmail({ gmail_remove_dots: false })
      .custom(async (value, { req }) => {
        return User.findOne({ email: value.toLowerCase() }).then(
          (existingUser) => {
            if (existingUser) {
              return Promise.reject('Account already exists!');
            }
          }
        );
      }),
    body('password')
      .trim()
      .isLength({ min: 5 })
      .withMessage('Please enter a password longer than 5 character!')
      .trim(),
    body('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('The password and confirm password are not matched!');
        }
        return true;
      })
      .trim(),
  ],
  register
);

router.put('/set-avatar/:userId', isAuth, setAvatar);

router.post(
  '/login',
  [
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please enter a valid email!')
      .normalizeEmail({ gmail_remove_dots: false }),
    body('password')
      .trim()
      .isLength({ min: 5 })
      .withMessage('Please enter a password longer than 5 character!')
      .trim(),
  ],
  login
);
router.post('/forgottenpassword', forgottenPassword);

router.post('/new-password', newPassword);

router.get('/get-user/:userId', isAuth, getUser);

export default router;

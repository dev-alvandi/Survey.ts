import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import sendgridTransport from 'nodemailer-sendgrid-transport';

import User, { UserType } from '../models/userModel';
import emailHtmlTemplate from '../utils/resetPasswordTemplate';
import customError from '../utils/customError';
import { clearImage } from '../utils/clearImageHandler';

require('dotenv').config({ path: `${__dirname}/../../.env` });
const FRONTEND_URL: string = process.env.FRONTEND_URL as string;
const JWT_SECRET_KEY: string = process.env.JWT_SECRET_KEY as string;
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN as string;

let transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        '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',
    },
  })
);

export const getUser: RequestHandler = (req, res, next) => {
  const { userId } = req.params;
  if (!userId) {
    throw customError('No user id was set!', 422);
  }

  User.findById(userId)

    .then((user) => {
      if (!user) {
        throw customError('No user with the sent credentials was found!', 422, [
          'User is not found!',
        ]);
      }
      res.status(200).json({ msg: 'User found!', user: user.toJSON() });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export const register: RequestHandler = (req, res, next) => {
  // Validation check!
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    throw customError(
      'Validation failed.',
      422,
      validationErrors.array().map((errObject) => errObject.msg)
    );
  }

  const { name, email, password } = req.body;
  let newUser: UserType;
  // Hashing password and submiting the user!
  const storingName = name.charAt(0).toUpperCase() + name.slice(1);
  bcrypt
    .hash(password, 12)
    .then(async (hashedPassword) => {
      const user = new User({
        name: storingName,
        email: email.toLowerCase(),
        password: hashedPassword,
        avatar: 'images/defaulAvatar.jpg',
      });
      newUser = await user.save();
      return email;
    })
    .then((email) => {
      const emailConfirmation = {
        to: email,
        from: 'm.Ghiasvand.edu@gmail.com',
        subject: 'Confirmation of signup',
        text: 'This is just a test to verify if this is your account!',
        html: '<p>You have successfully signed up!</p>',
      };
      return transporter.sendMail(emailConfirmation, (err, res) => {
        if (err) {
          console.log(err);
        }
        console.log(res);
      });
    })
    .then(() => {
      return res.json({
        msg: 'Account created successfully!',
        status: 200,
        newUser: newUser,
      });
    })
    .catch((err) => console.log(err));
};

export const setAvatar: RequestHandler = (req, res, next) => {
  if (!req.files) {
    throw customError('File upload invalid.', 422, [
      'No avatar image is provided.',
    ]);
  }

  const { userId } = req.params;

  if (!userId) {
    throw customError('No user id was set!', 422);
  }

  // @ts-ignore
  const splittedAvatarUrl = req.files.avatar[0].path.split('/');
  const avatarUrl = 'images/' + splittedAvatarUrl[splittedAvatarUrl.length - 1];

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw customError('No user with the sent credentials was found!', 422, [
          'User is not found!',
        ]);
      }

      if (avatarUrl !== user.avatar) {
        clearImage(user.avatar);
      }

      user.avatar = avatarUrl;
      return user.save();
    })
    .then((updatedUser) => {
      res.status(201).json({
        msg: 'Avatar was changed successfully.',
        image: updatedUser.avatar,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export const login: RequestHandler = (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    throw customError(
      'Validation failed.',
      422,
      validationErrors.array().map((errObject) => errObject.msg)
    );
  }

  const { email, password } = req.body;
  let loadedUser: UserType | any;
  User.findOne({ email: email.toLowerCase() })
    .then((user) => {
      if (!user) {
        throw customError('No user with the sent credentials was found!', 422);
      }

      loadedUser = user;
      return bcrypt.compare(password, user!.password);
    })
    .then((isPasswordMatch) => {
      if (!isPasswordMatch) {
        throw customError('Password is inccorect!', 401);
      }
      const token = jwt.sign(
        {
          name: loadedUser.name,
          email: loadedUser.email,
          userId: loadedUser._id.toString(),
        },
        JWT_SECRET_KEY,
        { expiresIn: JWT_EXPIRES_IN }
      );
      return res.status(200).json({
        msg: 'You are logged in :)',
        user: loadedUser.toJSON(),
        token: token,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export const forgottenPassword: RequestHandler = (req, res, next) => {
  const { email } = req.body;

  // Vallidate the inputs
  crypto.randomBytes(32, (err, buffer) => {
    const token = buffer.toString('hex');
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          return res.json({ msg: 'Account does not exist!', status: 404 });
        }
        user.resetToken = token;
        user.resetTokenExpiration = new Date(Date.now() + 3600000);
        return res.json({
          msg: 'Email has been sent to your email address',
          status: 200,
          token,
        });
      })
      .then((result) => {
        const emailReset: {} = {
          to: email,
          from: 'm.Ghiasvand.edu@gmail.com',
          subject: 'Reset Password',
          //   html: `
          //   <p>You have requested a password reset!</p>
          //   <p>Click this <a href="${FRONTEND_URL}/new-password/${token}">link</a> to set a new password.</p>
          // `,
          html: emailHtmlTemplate(`${FRONTEND_URL}/new-password/${token}`),
        };
        return transporter.sendMail(emailReset, (err, res) => {
          if (err) {
            console.log(err);
          }
        });
      })
      .catch((err) => console.log(err));
  });
};

export const newPassword: RequestHandler = (req, res, next) => {
  const { rePassword, confirmRePassword } = req.body;
  console.log(rePassword);
};

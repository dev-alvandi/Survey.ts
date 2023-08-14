import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import sendgridTransport from 'nodemailer-sendgrid-transport';

import User, { UserType } from '../models/userModel';
import emailHtmlTemplate from '../utils/resetPasswordTemplate';

require('dotenv').config({ path: `${__dirname}/../../.env` });
const FRONTEND_URL: string = process.env.FRONTEND_URL as string;
const JWT_SECRET_KEY: string = process.env.JWT_SECRET_KEY as string;

let transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        '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',
    },
  })
);

export const register: RequestHandler = (req, res, next) => {
  // Validation check!
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const error: any = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = validationErrors.array();
    throw error;
  }

  const { name, email, password } = req.body;
  // Hashing password and submiting the user!
  const storingName = name.charAt(0).toUpperCase() + name.slice(1);
  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        name: storingName,
        email: email.toLowerCase(),
        password: hashedPassword,
      });
      user.save();
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
      return res.json({ msg: 'Account created successfully!', status: 200 });
    })
    .catch((err) => console.log(err));
};

export const login: RequestHandler = (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const error: any = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = validationErrors.array();
    throw error;
  }

  const { email, password } = req.body;
  let loadedUser: UserType;
  User.findOne({ email: email.toLowerCase() })
    .then((user) => {
      if (!user) {
        const error: any = new Error(
          'No user with the sent credentials was found!'
        );
        error.statusCode = 422;
        error.data = validationErrors.array();
        throw error;
      }

      loadedUser = user;
      return bcrypt.compare(password, user!.password);
    })
    .then((isPasswordMatch) => {
      if (!isPasswordMatch) {
        const error: any = new Error('Password is inccorect!');
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        { name: loadedUser.name, email: loadedUser.email },
        JWT_SECRET_KEY,
        { expiresIn: '1h' }
      );
      return res.status(200).json({
        msg: 'You are logged in :)',
        user: {
          userId: loadedUser._id.toString(),
          name: loadedUser.name,
          email: loadedUser.email,
          likedPosts: loadedUser.likedPosts,
          token: token,
        },
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

export const logout: RequestHandler = (req, res, next) => {
  // req.session.destroy((err) => {
  //   if (err) {
  //     console.log(err);
  //   }
  //   return res.json({ isLoggedIn: false });
  // });
};

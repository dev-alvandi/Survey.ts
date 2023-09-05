"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newPassword = exports.forgottenPassword = exports.login = exports.setAvatar = exports.register = exports.getUser = void 0;
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const nodemailer_sendgrid_transport_1 = __importDefault(require("nodemailer-sendgrid-transport"));
const userModel_1 = __importDefault(require("../models/userModel"));
const resetPasswordTemplate_1 = __importDefault(require("../utils/resetPasswordTemplate"));
const customError_1 = __importDefault(require("../utils/customError"));
const clearImageHandler_1 = require("../utils/clearImageHandler");
require('dotenv').config({ path: `${__dirname}/../../.env` });
const FRONTEND_URL = process.env.FRONTEND_URL;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
let transporter = nodemailer_1.default.createTransport((0, nodemailer_sendgrid_transport_1.default)({
    auth: {
        api_key: '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',
    },
}));
const getUser = (req, res, next) => {
    const { userId } = req.params;
    if (!userId) {
        throw (0, customError_1.default)('No user id was set!', 422);
    }
    userModel_1.default.findById(userId)
        .then((user) => {
        if (!user) {
            throw (0, customError_1.default)('No user with the sent credentials was found!', 422, [
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
exports.getUser = getUser;
const register = (req, res, next) => {
    // Validation check!
    const validationErrors = (0, express_validator_1.validationResult)(req);
    if (!validationErrors.isEmpty()) {
        throw (0, customError_1.default)('Validation failed.', 422, validationErrors.array().map((errObject) => errObject.msg));
    }
    const { name, email, password } = req.body;
    let newUser;
    // Hashing password and submiting the user!
    const storingName = name.charAt(0).toUpperCase() + name.slice(1);
    bcrypt_1.default
        .hash(password, 12)
        .then((hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
        const user = new userModel_1.default({
            name: storingName,
            email: email.toLowerCase(),
            password: hashedPassword,
            avatar: 'images/defaulAvatar.jpg',
        });
        newUser = yield user.save();
        return email;
    }))
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
exports.register = register;
const setAvatar = (req, res, next) => {
    if (!req.files) {
        throw (0, customError_1.default)('File upload invalid.', 422, [
            'No avatar image is provided.',
        ]);
    }
    const { userId } = req.params;
    if (!userId) {
        throw (0, customError_1.default)('No user id was set!', 422);
    }
    // @ts-ignore
    const splittedAvatarUrl = req.files.avatar[0].path.split('/');
    const avatarUrl = 'images/' + splittedAvatarUrl[splittedAvatarUrl.length - 1];
    userModel_1.default.findById(userId)
        .then((user) => {
        if (!user) {
            throw (0, customError_1.default)('No user with the sent credentials was found!', 422, [
                'User is not found!',
            ]);
        }
        if (avatarUrl !== user.avatar) {
            (0, clearImageHandler_1.clearImage)(user.avatar);
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
exports.setAvatar = setAvatar;
const login = (req, res, next) => {
    const validationErrors = (0, express_validator_1.validationResult)(req);
    if (!validationErrors.isEmpty()) {
        throw (0, customError_1.default)('Validation failed.', 422, validationErrors.array().map((errObject) => errObject.msg));
    }
    const { email, password } = req.body;
    let loadedUser;
    userModel_1.default.findOne({ email: email.toLowerCase() })
        .then((user) => {
        if (!user) {
            throw (0, customError_1.default)('No user with the sent credentials was found!', 422);
        }
        loadedUser = user;
        return bcrypt_1.default.compare(password, user.password);
    })
        .then((isPasswordMatch) => {
        if (!isPasswordMatch) {
            throw (0, customError_1.default)('Password is inccorect!', 401);
        }
        const token = jsonwebtoken_1.default.sign({
            name: loadedUser.name,
            email: loadedUser.email,
            userId: loadedUser._id.toString(),
        }, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRES_IN });
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
exports.login = login;
const forgottenPassword = (req, res, next) => {
    const { email } = req.body;
    // Vallidate the inputs
    crypto_1.default.randomBytes(32, (err, buffer) => {
        const token = buffer.toString('hex');
        userModel_1.default.findOne({ email })
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
            const emailReset = {
                to: email,
                from: 'm.Ghiasvand.edu@gmail.com',
                subject: 'Reset Password',
                //   html: `
                //   <p>You have requested a password reset!</p>
                //   <p>Click this <a href="${FRONTEND_URL}/new-password/${token}">link</a> to set a new password.</p>
                // `,
                html: (0, resetPasswordTemplate_1.default)(`${FRONTEND_URL}/new-password/${token}`),
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
exports.forgottenPassword = forgottenPassword;
const newPassword = (req, res, next) => {
    const { rePassword, confirmRePassword } = req.body;
    console.log(rePassword);
};
exports.newPassword = newPassword;

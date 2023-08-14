"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePost = exports.getPost = exports.getPosts = void 0;
const express_validator_1 = require("express-validator");
const postModel_1 = __importDefault(require("../models/postModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const getPosts = (req, res, next) => {
    const currPage = +req.query.page || 1;
    const perPage = 5;
    let totalItems;
    postModel_1.default.find()
        .countDocuments()
        .then((count) => {
        totalItems = count;
        return postModel_1.default.find()
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
exports.getPosts = getPosts;
const getPost = (req, res, next) => {
    const { postId } = req.params;
    postModel_1.default.findById(postId)
        .then((post) => {
        if (!post) {
            const error = new Error('No post with this credential was found!');
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
exports.getPost = getPost;
const CreatePost = (req, res, next) => {
    // console.log(req.body);
    const validationErrors = (0, express_validator_1.validationResult)(req);
    if (!validationErrors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = validationErrors.array();
        throw error;
    }
    if (!req.body.imageUrl) {
        const error = new Error('File upload invalid');
        error.statusCode = 422;
        error.data = [{ msg: 'No image is provided.' }];
        throw error;
    }
    const { title, caption, creatorId, imageUrl } = req.body;
    // const imageUrl = req.file.path;
    userModel_1.default.findById(creatorId)
        .then((user) => {
        if (!user) {
            const error = new Error('No user with the sent credentials was found!');
            error.statusCode = 422;
            error.data = validationErrors.array();
            throw error;
        }
        const newPost = new postModel_1.default({
            title: title,
            imageUrl: imageUrl,
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
exports.CreatePost = CreatePost;

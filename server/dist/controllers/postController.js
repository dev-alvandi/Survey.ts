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
exports.deletePost = exports.editPost = exports.likePost = exports.CreatePost = exports.getPost = exports.getMyPosts = exports.getPosts = void 0;
const mongoose_1 = require("mongoose");
const express_validator_1 = require("express-validator");
const postModel_1 = __importDefault(require("../models/postModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const clearImageHandler_1 = require("../utils/clearImageHandler");
const customError_1 = __importDefault(require("../utils/customError"));
const getPosts = (req, res, next) => {
    const { userId } = req.query;
    const currPage = +req.query.page || 1;
    const perPage = 5;
    let totalItems;
    let loadedPosts = [];
    return postModel_1.default.find()
        .countDocuments()
        .then((count) => {
        totalItems = count;
        return postModel_1.default.find()
            .populate('creator')
            .skip((currPage - 1) * perPage)
            .limit(perPage);
    })
        .then((posts) => {
        loadedPosts = posts;
        if (!userId) {
            return res.status(200).json({
                msg: 'Fetched posts successfully.',
                posts: [...posts],
                isUser: false,
            });
        }
        return userModel_1.default.findById(req.userId).populate({
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
                let loadedCreator;
                const isLiked = user.likedPosts.find((likedPost) => likedPost.toString() === post._id.toString());
                const newPost = Object.assign(Object.assign({}, post.toObject()), { isLiked: isLiked ? true : false, 
                    // @ts-ignore
                    creator: post.toObject().creator });
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
exports.getPosts = getPosts;
const getMyPosts = (req, res, next) => {
    const { userId, page } = req.query;
    const currPage = +page || 1;
    const perPage = 5;
    let totalItems;
    let loadedPosts = [];
    return postModel_1.default.find({ creator: new mongoose_1.Types.ObjectId(userId) })
        .countDocuments()
        .then((count) => {
        totalItems = count;
        return postModel_1.default.find({ creator: new mongoose_1.Types.ObjectId(userId) })
            .populate('creator')
            .skip((currPage - 1) * perPage)
            .limit(perPage);
    })
        .then((posts) => {
        loadedPosts = posts;
        if (!userId) {
            throw (0, customError_1.default)('User id not found', 422);
        }
        return userModel_1.default.findById(req.userId).populate({
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
                let loadedCreator;
                const isLiked = user.likedPosts.find((likedPost) => likedPost.toString() === post._id.toString());
                const newPost = Object.assign(Object.assign({}, post.toObject()), { isLiked: isLiked ? true : false, 
                    // @ts-ignore
                    creator: post.toObject().creator });
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
exports.getMyPosts = getMyPosts;
const getPost = (req, res, next) => {
    const { postId } = req.params;
    postModel_1.default.findById(postId)
        .populate('creator')
        .populate({ path: 'comments', populate: { path: 'creator' } })
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
    const validationErrors = (0, express_validator_1.validationResult)(req);
    if (!validationErrors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = validationErrors.array();
        throw error;
    }
    if (!req.files) {
        const error = new Error('File upload invalid');
        error.statusCode = 422;
        error.data = [{ msg: 'No image is provided.' }];
        throw error;
    }
    const { title, caption } = req.body;
    const splittedImageUrl = req.files.image[0].path.split('/');
    const imageUrl = 'images/' + splittedImageUrl[splittedImageUrl.length - 1];
    let creator;
    const newPost = new postModel_1.default({
        title: title,
        imageUrl: imageUrl,
        caption: caption,
        creator: req.userId,
    });
    newPost
        .save()
        .then((result) => {
        return userModel_1.default.findById(req.userId);
    })
        .then((user) => {
        if (!user) {
            const error = new Error('User not found!');
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
exports.CreatePost = CreatePost;
const likePost = (req, res, next) => {
    const { postId } = req.query;
    const { userId, isLiked } = req.body;
    userModel_1.default.findById(userId)
        .then((user) => {
        if (!user) {
            const error = new Error('No user with the sent credentials was found!');
            error.statusCode = 422;
            error.data = [{ msg: 'User is not found.' }];
            throw error;
        }
        return postModel_1.default.findById(postId);
    })
        .then((loadedPost) => __awaiter(void 0, void 0, void 0, function* () {
        if (!loadedPost) {
            const error = new Error('Post is not sent!');
            error.statusCode = 422;
            error.data = [{ msg: 'User is not found.' }];
            throw error;
        }
        const hasAlreadyLikedIndex = loadedPost.likes.findIndex((userIdWhoLikedPost) => userIdWhoLikedPost === userId);
        if (isLiked && hasAlreadyLikedIndex === -1) {
            yield userModel_1.default.findByIdAndUpdate(userId, { $push: { likedPosts: postId } });
            return postModel_1.default.findByIdAndUpdate(postId, { $push: { likes: userId } }, { new: true });
        }
        else if (!isLiked && hasAlreadyLikedIndex > -1) {
            yield userModel_1.default.findByIdAndUpdate(userId, { $pull: { likedPosts: postId } });
            return postModel_1.default.findByIdAndUpdate(postId, { $pull: { likes: userId } }, { new: true });
        }
    }))
        .then((updatedPost) => {
        if (!updatedPost) {
            throw (0, customError_1.default)('Post cannot get updated at the moment!', 422);
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
exports.likePost = likePost;
const editPost = (req, res, next) => {
    //* Validation Check
    const validationErrors = (0, express_validator_1.validationResult)(req);
    if (!validationErrors.isEmpty()) {
        throw (0, customError_1.default)('Validation failed.', 422, validationErrors.array().map((errObject) => errObject.msg));
    }
    const { postId } = req.params;
    const { title, caption } = req.body;
    let imageUrl = req.body.image;
    if (req.files) {
        imageUrl = req.files.image[0].path;
    }
    if (!imageUrl) {
        throw (0, customError_1.default)('No image has been picked!', 422);
    }
    postModel_1.default.findById(postId)
        .then((post) => {
        if (!post) {
            throw (0, customError_1.default)('No post with the sent credentials was found!', 422, validationErrors.array().map((errObject) => errObject.msg));
        }
        if (post.creator.toString() !== req.userId) {
            throw (0, customError_1.default)('User is not authorized!', 403, validationErrors.array().map((errObject) => errObject.msg));
        }
        if (imageUrl !== post.imageUrl) {
            (0, clearImageHandler_1.clearImage)(post.imageUrl);
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
exports.editPost = editPost;
const deletePost = (req, res, next) => {
    const { postId } = req.params;
    postModel_1.default.findById(postId)
        .then((post) => {
        if (!post) {
            const error = new Error('No post with the sent credentials was found!');
            error.statusCode = 422;
            throw error;
        }
        if (post.creator.toString() !== req.userId) {
            const error = new Error('User is not authorized!');
            error.statusCode = 422;
            throw error;
        }
        (0, clearImageHandler_1.clearImage)(post.imageUrl);
        return postModel_1.default.findByIdAndRemove(postId);
    })
        .then((result) => {
        return userModel_1.default.findById(req.userId);
    })
        .then((user) => {
        if (!user) {
            const error = new Error('User not found!');
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
exports.deletePost = deletePost;

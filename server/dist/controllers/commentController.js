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
exports.likeComment = exports.deleteComment = exports.editComment = exports.newComment = void 0;
const express_validator_1 = require("express-validator");
const socket_1 = __importDefault(require("../socket"));
const postModel_1 = __importDefault(require("../models/postModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const commentModel_1 = __importDefault(require("../models/commentModel"));
const customError_1 = __importDefault(require("../utils/customError"));
const newComment = (req, res, next) => {
    const validationErrors = (0, express_validator_1.validationResult)(req);
    if (!validationErrors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = validationErrors.array();
        throw error;
    }
    const { postId } = req.params;
    const { comment } = req.body;
    const newComment = new commentModel_1.default({
        creator: req.userId,
        relatedPost: postId,
        text: comment,
    });
    return newComment
        .save()
        .then((result) => {
        return postModel_1.default.findById(postId);
    })
        .then((post) => {
        if (!post) {
            const error = new Error('Post not found!');
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
        socket_1.default.getIO().emit('comments', {
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
exports.newComment = newComment;
const editComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentId } = req.params;
    const { comment: text } = req.body;
    if (!commentId) {
        throw (0, customError_1.default)('Comment id is not provided for delete action.', 422);
    }
    let loadedComment;
    commentModel_1.default.findById(commentId)
        .then((comment) => {
        if (!comment) {
            throw (0, customError_1.default)('No comment with such an id was found! ', 422);
        }
        if (comment.creator.toString() !== req.userId.toString()) {
            throw (0, customError_1.default)('User is not authorised to delete this comment! ', 422);
        }
        if (comment.text === text) {
            res.status(304).json({ msg: 'Comment is not edited' });
        }
        comment.text = text;
        return comment.save();
    })
        .then((newComment) => {
        return postModel_1.default.findById(newComment.relatedPost)
            .populate({
            path: 'comments',
            populate: { path: 'creator' },
        })
            .populate('creator');
    })
        .then((newPopulatedPost) => {
        console.log(newPopulatedPost);
        socket_1.default.getIO().emit('comments', {
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
});
exports.editComment = editComment;
const deleteComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentId } = req.params;
    if (!commentId) {
        throw (0, customError_1.default)('Comment id is not provided for delete action.', 422);
    }
    let loadedComment;
    commentModel_1.default.findById(commentId)
        .then((comment) => {
        if (!comment) {
            throw (0, customError_1.default)('No comment with such an id was found! ', 422);
        }
        if (comment.creator.toString() !== req.userId.toString()) {
            throw (0, customError_1.default)('User is not authorised to delete this comment! ', 422);
        }
        loadedComment = comment;
        return commentModel_1.default.findByIdAndRemove(commentId);
    })
        .then((result) => {
        return postModel_1.default.findById(loadedComment.relatedPost);
    })
        .then((post) => {
        if (!post) {
            throw (0, customError_1.default)('No post was found from which such comment could be deleted! ', 422);
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
        socket_1.default.getIO().emit('comments', {
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
});
exports.deleteComment = deleteComment;
const likeComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentId } = req.query;
    const { userId, isLiked } = req.body;
    userModel_1.default.findById(userId)
        .then((user) => {
        if (!user) {
            throw (0, customError_1.default)('No user with the sent credentials was found!', 422, [
                'User is not found.',
            ]);
        }
        return commentModel_1.default.findById(commentId);
    })
        .then((loadedComment) => __awaiter(void 0, void 0, void 0, function* () {
        if (!loadedComment) {
            throw (0, customError_1.default)('Comment is not found!', 422);
        }
        const hasAlreadyLikedIndex = loadedComment.likes.findIndex((userIdWhoLikedPost) => userIdWhoLikedPost === userId);
        if (isLiked && hasAlreadyLikedIndex === -1) {
            // console.log('Liked');
            yield userModel_1.default.findByIdAndUpdate(userId, {
                $push: { likedComments: commentId },
            });
            return commentModel_1.default.findByIdAndUpdate(commentId, { $push: { likes: userId } }, { new: true });
        }
        else if (!isLiked && hasAlreadyLikedIndex > -1) {
            yield userModel_1.default.findByIdAndUpdate(userId, {
                $pull: { likedComments: commentId },
            });
            return commentModel_1.default.findByIdAndUpdate(commentId, { $pull: { likes: userId } }, { new: true });
        }
    }))
        .then((updatedComment) => {
        console.log(isLiked);
        if (!updatedComment) {
            throw (0, customError_1.default)('Liking comment failed', 500);
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
});
exports.likeComment = likeComment;

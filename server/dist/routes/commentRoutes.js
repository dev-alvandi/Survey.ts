"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const commentController_1 = require("../controllers/commentController");
const isAuth_1 = __importDefault(require("../middleware/isAuth"));
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
router.post('/new-comment/:postId', isAuth_1.default, [
    (0, express_validator_1.body)('comment', 'Please write a comment shorter than 280 characters.').isLength({ min: 1, max: 280 }),
], commentController_1.newComment);
router.put('/like-comment', isAuth_1.default, commentController_1.likeComment);
router.put('/edit-comment/:commentId', isAuth_1.default, commentController_1.editComment);
router.delete('/delete-comment/:commentId', isAuth_1.default, commentController_1.deleteComment);
exports.default = router;

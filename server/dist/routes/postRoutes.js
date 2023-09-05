"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const postController_1 = require("../controllers/postController");
const isAuth_1 = __importDefault(require("../middleware/isAuth"));
const router = (0, express_1.Router)();
router.get('/receive-posts/', postController_1.getPosts);
router.get('/receive-myPosts/', isAuth_1.default, postController_1.getMyPosts);
router.get('/receive-post/:postId', postController_1.getPost);
router.post('/create-post', isAuth_1.default, [
    (0, express_validator_1.body)('title', 'Please write a title longer than 5 characters..').isLength({
        min: 5,
    }),
    (0, express_validator_1.body)('caption', 'Please write a caption longer than 5 characters.').isLength({ min: 5 }),
], postController_1.CreatePost);
router.put('/like-post', isAuth_1.default, postController_1.likePost);
router.put('/edit-post/:postId', isAuth_1.default, [
    (0, express_validator_1.body)('title', 'Please write a title longer than 5 characters.').isLength({
        min: 5,
    }),
    (0, express_validator_1.body)('caption', 'Please write a caption longer than 5 characters.').isLength({ min: 5 }),
], postController_1.editPost);
router.delete('/delete-post/:postId', isAuth_1.default, postController_1.deletePost);
exports.default = router;

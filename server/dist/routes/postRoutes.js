"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const postController_1 = require("../controllers/postController");
const router = (0, express_1.Router)();
router.get('/receive-posts', postController_1.getPosts);
router.get('/receive-post/:postId', postController_1.getPost);
router.post('/create-post', [
    (0, express_validator_1.body)('title', 'Please write a correct Title.').isAlphanumeric('sv-SE', {
        ignore: ' ',
    }),
    (0, express_validator_1.body)('caption', 'Please write a caption longer than 5 characters.').isLength({ min: 5 }),
], postController_1.CreatePost);
exports.default = router;

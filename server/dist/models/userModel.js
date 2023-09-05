"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    },
    resetToken: String,
    resetTokenExpiration: Date,
    likedPosts: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Post',
        },
    ],
    likedComments: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Comment',
        },
    ],
    myPosts: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Post',
        },
    ],
});
userSchema.methods.toJSON = function () {
    const copyObj = this.toObject();
    if (copyObj.password) {
        delete copyObj.password;
    }
    return copyObj;
};
exports.default = (0, mongoose_1.model)('User', userSchema);

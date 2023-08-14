"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    caption: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    likes: {
        type: Number,
    },
    comments: {
        type: [
            {
                userId: {
                    type: mongoose_1.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                },
                commentedAt: {
                    type: Date,
                    required: true,
                },
                editedAt: {
                    type: Date,
                    required: true,
                },
            },
        ],
        required: false,
    },
    creator: {
        userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
        name: {
            type: String,
            required: true,
        },
    },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});
exports.default = (0, mongoose_1.model)('Post', postSchema);

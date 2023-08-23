"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearImage = void 0;
const fs_1 = __importDefault(require("fs"));
const clearImage = (filePath) => {
    const fileAddress = filePath;
    fs_1.default.unlink(fileAddress, (err) => {
        if (err) {
            console.log('File is not deleted!', err);
        }
    });
};
exports.clearImage = clearImage;

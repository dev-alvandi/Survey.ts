"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const customError_1 = __importDefault(require("../utils/customError"));
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
exports.default = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        throw (0, customError_1.default)('Not authenticated!', 401);
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jsonwebtoken_1.default.verify(token, JWT_SECRET_KEY);
    }
    catch (error) {
        error.statusCode = 401;
        next(error);
    }
    if (!decodedToken) {
        throw (0, customError_1.default)('Not authenticated!', 401);
    }
    req.userId = decodedToken.userId;
    next();
};

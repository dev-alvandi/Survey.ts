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
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const userModel_1 = __importDefault(require("../models/userModel"));
const authControllers_1 = require("../controllers/authControllers");
const isAuth_1 = __importDefault(require("../middleware/isAuth"));
const router = (0, express_1.Router)();
// Post routes
router.put('/register', [
    (0, express_validator_1.body)('name', 'Please enter a valid name!')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Please enter a name longer than 3 character!')
        .isAlpha('sv-SE', { ignore: ' ' })
        .withMessage('Please enter a valid name!'),
    (0, express_validator_1.body)('email')
        .trim()
        .isEmail()
        .withMessage('Please enter a valid email!')
        .normalizeEmail({ gmail_remove_dots: false })
        .custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
        return userModel_1.default.findOne({ email: value.toLowerCase() }).then((existingUser) => {
            if (existingUser) {
                return Promise.reject('Account already exists!');
            }
        });
    })),
    (0, express_validator_1.body)('password')
        .trim()
        .isLength({ min: 5 })
        .withMessage('Please enter a password longer than 5 character!')
        .trim(),
    (0, express_validator_1.body)('confirmPassword')
        .trim()
        .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('The password and confirm password are not matched!');
        }
        return true;
    })
        .trim(),
], authControllers_1.register);
router.put('/set-avatar/:userId', isAuth_1.default, authControllers_1.setAvatar);
router.post('/login', [
    (0, express_validator_1.body)('email')
        .trim()
        .isEmail()
        .withMessage('Please enter a valid email!')
        .normalizeEmail({ gmail_remove_dots: false }),
    (0, express_validator_1.body)('password')
        .trim()
        .isLength({ min: 5 })
        .withMessage('Please enter a password longer than 5 character!')
        .trim(),
], authControllers_1.login);
router.post('/forgottenpassword', authControllers_1.forgottenPassword);
router.post('/new-password', authControllers_1.newPassword);
router.get('/get-user/:userId', isAuth_1.default, authControllers_1.getUser);
exports.default = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isAuth = (req, res, next) => {
    // if (!req.session.isLoggedIn) {
    //   console.log(1);
    //   return res.redirect('/login');
    // }
    next();
};
exports.default = isAuth;

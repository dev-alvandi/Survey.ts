"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const customError = (errMsg, errStatus, errData = errMsg) => {
    const error = new Error(errMsg);
    error.statusCode = errStatus;
    console.log(errData);
    if (errData === errMsg) {
        error.data = [errMsg];
    }
    else {
        // console.log(errData);
        error.data = errData;
    }
    return error;
};
exports.default = customError;

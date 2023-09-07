"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let io;
class Socket {
}
Socket.init = (httpServer, options) => {
    io = require('socket.io')(httpServer, Object.assign({}, options));
    return io;
};
Socket.getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};
exports.default = Socket;

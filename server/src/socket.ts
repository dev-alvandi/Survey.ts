import { Server } from 'socket.io';

let io: any;

export default class Socket {
  public io: any;

  static init = (httpServer: any, options: {}) => {
    io = require('socket.io')(httpServer, { ...options });
    return io;
  };

  static getIO = () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  };
}

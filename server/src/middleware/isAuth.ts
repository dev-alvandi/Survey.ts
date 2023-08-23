import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { UserAuthInfoRequest } from '../utils/typeDefinitions';
const JWT_SECRET_KEY: string = process.env.JWT_SECRET_KEY as string;

export default (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error: any = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, JWT_SECRET_KEY) as JwtPayload;
  } catch (error: any) {
    error.statusCode = 500;
    next(error);
  }

  if (!decodedToken) {
    const error: any = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};

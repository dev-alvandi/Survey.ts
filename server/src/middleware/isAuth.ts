import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { UserAuthInfoRequest } from '../utils/typeDefinitions';
import customError from '../utils/customError';
const JWT_SECRET_KEY: string = process.env.JWT_SECRET_KEY as string;

export default (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    throw customError('Not authenticated!', 401);
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, JWT_SECRET_KEY) as JwtPayload;
  } catch (error: any) {
    error.statusCode = 401;
    next(error);
  }

  if (!decodedToken) {
    throw customError('Not authenticated!', 401);
  }
  req.userId = decodedToken.userId;
  next();
};

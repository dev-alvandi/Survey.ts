// dependancies
import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import multer, { FileFilterCallback } from 'multer';
import mongoose, { ConnectOptions } from 'mongoose';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { createWriteStream, readFileSync } from 'fs';
import { Http2ServerRequest } from 'http2';

// custom imports
import User from './models/userModel';
import authRoutes from './routes/authRoutes';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';
import Socket from './socket';

// .ENV import
require('dotenv').config({ path: `${__dirname}/../.env` });
const MONGO_URL: string = process.env.MONGO_URL as string;
const PORT: string = process.env.PORT as string;
const FRONTEND_URL: string = process.env.FRONTEND_URL as string;

// Basic establishments
const app = express();

const fileStorage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, path.join(__dirname, '../images'));
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  if (
    file.mimetype === 'image/webp' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.json());
app.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter,
  }).fields([{ name: 'image' }, { name: 'avatar' }])
);
app.use('/images', express.static(path.join(__dirname, '../images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Routes setups
app.use('/api/auth', authRoutes);
app.use('/api/feed', postRoutes);
app.use('/api/feed', commentRoutes);

const accessLogStream = createWriteStream(path.join(__dirname, 'access.log'), {
  flags: 'a',
});

app.use(helmet());
app.use(compression());
app.use(morgan('combined', { stream: accessLogStream }));

// Error handling middleware
type ErrorType = {
  statusCode: number;
  message: string;
  data: [];
};
app.use((error: ErrorType, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  const status = error.statusCode || 500;
  const { message, data } = error;
  res.status(status).json({ msg: message, data: data });
});

// Database and Server connection
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then(() => {
    const server = app.listen(PORT);
    const io = Socket.init(server, {
      cors: {
        origin: FRONTEND_URL,
        methods: ['GET, POST, PUT, PATCH, DELETE'],
      },
    });
    io.on('connection', (socket: any) => {
      console.log('Socket.io is connected!');
    });

    return;
  })
  .then(() =>
    console.log('Dadabase connection and server are maintained successfully!')
  )
  .catch((err) => {
    console.log(err.message);
  });

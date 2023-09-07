"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// dependancies
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const mongoose_1 = __importDefault(require("mongoose"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const fs_1 = require("fs");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
const socket_1 = __importDefault(require("./socket"));
// .ENV import
require('dotenv').config({ path: `${__dirname}/../.env` });
const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT;
const FRONTEND_URL = process.env.FRONTEND_URL;
// Basic establishments
const app = (0, express_1.default)();
const fileStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, '../images'));
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    },
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/webp' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
app.use(body_parser_1.default.json());
app.use((0, multer_1.default)({
    storage: fileStorage,
    fileFilter: fileFilter,
}).fields([{ name: 'image' }, { name: 'avatar' }]));
app.use('/images', express_1.default.static(path_1.default.join(__dirname, '../images')));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
// Routes setups
app.use('/api/auth', authRoutes_1.default);
app.use('/api/feed', postRoutes_1.default);
app.use('/api/feed', commentRoutes_1.default);
const accessLogStream = (0, fs_1.createWriteStream)(path_1.default.join(__dirname, 'access.log'), {
    flags: 'a',
});
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use((0, morgan_1.default)('combined', { stream: accessLogStream }));
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const { message, data } = error;
    res.status(status).json({ msg: message, data: data });
});
// Database and Server connection
mongoose_1.default
    .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
    const server = app.listen(PORT);
    const io = socket_1.default.init(server, {
        cors: {
            origin: FRONTEND_URL,
            methods: ['GET, POST, PUT, PATCH, DELETE'],
        },
    });
    io.on('connection', (socket) => {
        console.log('Socket.io is connected!');
    });
    return;
})
    .then(() => console.log('Dadabase connection and server are maintained successfully!'))
    .catch((err) => {
    console.log(err.message);
});

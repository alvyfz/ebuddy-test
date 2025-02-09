'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const resHandler_1 = require("commons/exceptions/resHandler");
const userRoutes_1 = __importDefault(require("routes/userRoutes"));
const cors = require('cors');
const bodyParser = require('body-parser');
var __importDefault = (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const dotenv_1 = __importDefault(require('dotenv'));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT_BACKEND || 3001;
const corsOptions = {
    credentials: true,
    origin: true
};
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use('/users', userRoutes_1.default);
app.use(function (error, req, res, next) {
    return (0, resHandler_1.resErrorHandler)(res, error);
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

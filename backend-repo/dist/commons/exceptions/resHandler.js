"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resSuccessHandler = exports.resErrorHandler = void 0;
const ClientError_1 = __importDefault(require("./ClientError"));
const resErrorHandler = (res, error) => {
    if (error.code === 'ECONNREFUSED') {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: 'service unavailable',
            dev: error.message
        });
    }
    if (error instanceof ClientError_1.default) {
        const response = {
            success: false,
            message: error.message,
            error: error.errors
        };
        return res.status(error.statusCode || 400).json(response);
    }
    if (error.response) {
        return res.status(error.response.status).json(error.response.data);
    }
    // Server ERROR!
    console.log(error);
    console.log(error.message);
    const response = {
        success: false,
        message: 'Sorry, something went wrong on the server',
        dev: error
    };
    return res.status(500).json(response);
};
exports.resErrorHandler = resErrorHandler;
const resSuccessHandler = (res, message, payload, code = 200) => {
    const response = {
        success: true,
        payload,
        message
    };
    return res.status(code).send(response);
};
exports.resSuccessHandler = resSuccessHandler;

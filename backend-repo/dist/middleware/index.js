"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const firebaseConfig_1 = require("@/config/firebaseConfig");
const AuthenticationError_1 = __importDefault(require("commons/exceptions/AuthenticationError"));
const firebase_admin_1 = require("firebase-admin");
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const idToken = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split('Bearer ')[1];
    try {
        if (!idToken) {
            throw new AuthenticationError_1.default('Unauthorized: No token provided');
        }
        const decodedToken = yield (0, firebase_admin_1.auth)(firebaseConfig_1.app).verifyIdToken(idToken);
        if (!decodedToken) {
            throw new AuthenticationError_1.default('Unauthorized: Invalid token');
        }
        res.locals.user = decodedToken;
        next();
    }
    catch (error) {
        if (error.code === 'auth/id-token-expired') {
            next(new AuthenticationError_1.default('Unauthorized: Token has expired'));
        }
        else {
            next(new AuthenticationError_1.default('Unauthorized: Invalid token'));
        }
    }
});
exports.authMiddleware = authMiddleware;

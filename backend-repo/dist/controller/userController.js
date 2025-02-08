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
exports.updateUser = exports.fetchUser = void 0;
const userCollection_1 = require("../repository/userCollection");
const NotFoundError_1 = __importDefault(require("commons/exceptions/NotFoundError"));
const resHandler_1 = require("commons/exceptions/resHandler");
// Endpoint untuk mengambil data user
const fetchUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, size } = req.query;
    try {
        const startAt = Number(size) * (Number(page) - 1);
        const userData = yield (0, userCollection_1.fetchUserData)(startAt, Number(size));
        if (!userData) {
            throw new NotFoundError_1.default('User not found');
        }
        (0, resHandler_1.resSuccessHandler)(res, 'Success', userData);
    }
    catch (error) {
        next(error);
    }
});
exports.fetchUser = fetchUser;
// Endpoint untuk mengupdate data user
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const userData = req.body;
    try {
        yield (0, userCollection_1.updateUserData)(userId, userData);
        (0, resHandler_1.resSuccessHandler)(res, 'User data updated successfully');
    }
    catch (error) {
        next(error);
    }
});
exports.updateUser = updateUser;

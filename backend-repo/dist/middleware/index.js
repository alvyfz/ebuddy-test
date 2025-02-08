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
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = void 0;
const middleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // access token value FB
        // const authHeader = req.headers.authorization || "";
        // const idToken = authHeader.startsWith("Bearer ")
        //     ? authHeader.substring(7, authHeader.length)
        //     : null;
        // if (!idToken) throw new Error("Unauthorized");
        // const decodedToken = await adminAuth.auth().verifyIdToken(idToken);
        // res.locals.decodedToken = decodedToken;
        return next();
    }
    catch (error) {
        return res.status(500).json({
            status: false,
            message: "service unavailable",
            dev: error.message,
        });
    }
});
exports.middleware = middleware;

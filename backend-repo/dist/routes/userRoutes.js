"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middleware");
const userController_1 = require("../controller/userController");
const router = express_1.default.Router();
// Endpoint untuk mengambil data user
router.get('/fetch-user-data', middleware_1.authMiddleware, userController_1.fetchUser);
// Endpoint untuk mengupdate data user
router.put('/update-user-data/:userId', middleware_1.authMiddleware, userController_1.updateUser);
exports.default = router;

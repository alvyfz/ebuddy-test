"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const serviceAccountKey_json_1 = __importDefault(require("./serviceAccountKey.json")); // File JSON dari Firebase Console
// Inisialisasi Firebase Admin SDK
(0, app_1.initializeApp)({
    credential: (0, app_1.cert)(serviceAccountKey_json_1.default),
});
// Inisialisasi Firestore
const db = (0, firestore_1.getFirestore)();
exports.db = db;

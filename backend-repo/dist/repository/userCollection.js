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
exports.updateUserData = exports.fetchUserData = void 0;
const getMultipleData_1 = __importDefault(require("commons/utils/getMultipleData"));
const firebaseConfig_1 = require("../config/firebaseConfig");
const usersCollection = firebaseConfig_1.db.collection('USERS');
const fetchUserData = (startAt, limit) => __awaiter(void 0, void 0, void 0, function* () {
    const [users, count] = yield Promise.all([
        usersCollection
            .orderBy('totalAverageWeightRatings', 'desc')
            .orderBy('numberOfRents', 'desc')
            .orderBy('recentlyActive', 'desc')
            .offset(startAt)
            .limit(limit)
            .get(),
        usersCollection.count().get()
    ]);
    return {
        count: count.data().count,
        data: (0, getMultipleData_1.default)(users.docs),
        totalPage: Math.ceil(count.data().count / limit)
    };
});
exports.fetchUserData = fetchUserData;
const updateUserData = (userId, userData) => __awaiter(void 0, void 0, void 0, function* () {
    yield usersCollection.doc(userId).update(userData);
});
exports.updateUserData = updateUserData;

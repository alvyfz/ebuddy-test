"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getMultipleData;
function getMultipleData(data) {
    return data.map((doc) => {
        return Object.assign({ id: doc.id }, doc.data());
    });
}

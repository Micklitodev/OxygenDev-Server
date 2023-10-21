"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const tempKeySchema = new mongoose_1.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
    },
    stripeSessionId: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: "1d",
    },
});
const TempKey = (0, mongoose_1.model)("TempKey", tempKeySchema);
exports.default = TempKey;

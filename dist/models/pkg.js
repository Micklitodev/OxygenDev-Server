"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PkgSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0.99,
    },
    popular: {
        type: Boolean,
    },
    features: [
        {
            type: String,
            required: true,
            trim: true,
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const Pkg = (0, mongoose_1.model)("Pkg", PkgSchema);
exports.default = Pkg;

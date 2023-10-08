"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signToken = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = "mysuper duper secret ";
const expiration = "2h";
const authMiddleware = ({ req }) => {
    var _a, _b, _c;
    let token = req.body.token || req.query.token || req.headers.authorization;
    if (req.headers.authorization) {
        token = (_c = (_b = (_a = token === null || token === void 0 ? void 0 : token.split(" ")) === null || _a === void 0 ? void 0 : _a.pop()) === null || _b === void 0 ? void 0 : _b.trim()) !== null && _c !== void 0 ? _c : null;
    }
    if (!token) {
        return req;
    }
    try {
        const { data } = jsonwebtoken_1.default.verify(token, secret, { maxAge: expiration });
        req.user = data;
    }
    catch (_d) {
        console.log("Invalid token");
    }
    return req;
};
exports.authMiddleware = authMiddleware;
const signToken = ({ firstName, email, _id, }) => {
    const payload = { firstName, email, _id };
    return jsonwebtoken_1.default.sign({ data: payload }, secret, { expiresIn: expiration });
};
exports.signToken = signToken;

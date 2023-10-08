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
const apollo_server_1 = require("apollo-server");
const models_1 = require("../models");
const auth_1 = require("../utils/auth");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const resolvers = {
    Query: {
        user: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            if (context.user) {
                try {
                    const user = yield models_1.User.findById(context.user._id);
                    return user;
                }
                catch (err) {
                    return console.log(err);
                }
            }
            else {
                throw new apollo_server_1.AuthenticationError("Not logged in");
            }
        }),
    },
    Mutation: {
        addUser: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            if (args.password.length < 5) {
                throw new apollo_server_1.AuthenticationError("Password is not long enough.");
            }
            if (!emailRegex.test(args.email)) {
                throw new apollo_server_1.AuthenticationError("Email is not in the correct format.");
            }
            try {
                const user = yield models_1.User.create(args);
                const token = (0, auth_1.signToken)(user);
                return { token, user };
            }
            catch (err) {
                throw new apollo_server_1.AuthenticationError("Account already exists.");
            }
        }),
        login: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { email, password } = args;
            if (!emailRegex.test(email)) {
                throw new apollo_server_1.AuthenticationError("Email is not in the correct format");
            }
            const user = yield models_1.User.findOne({ email });
            if (!user) {
                throw new apollo_server_1.AuthenticationError("Incorrect credentials");
            }
            const correctPw = yield user.isCorrectPassword(password);
            if (!correctPw) {
                throw new apollo_server_1.AuthenticationError("Incorrect credentials");
            }
            const token = (0, auth_1.signToken)(user);
            if (!token) {
                throw new apollo_server_1.AuthenticationError("Incorrect credentials");
            }
            return { token, user };
        }),
    },
};
exports.default = resolvers;

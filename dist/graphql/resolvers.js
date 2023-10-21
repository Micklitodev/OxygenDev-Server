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
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const stripeapi = process.env.STRIPE_KEY;
const stripe = require("stripe")(stripeapi);
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const taxPercent = 8.75;
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
        getPkg: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            return yield models_1.Pkg.find();
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
        checkoutSess: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            if (context.user) {
                throw new Error("Not logged in");
            }
            // const url = new URL(context.headers.referer).origin;
            const url = "http://localhost:3000";
            const line_items = [];
            // push each product as line item
            const pkg = yield models_1.Pkg.findById(args.pkg);
            const product = yield stripe.products.create({
                name: pkg.name,
                description: pkg.description,
                images: [`${pkg.image}`],
            });
            const price = yield stripe.prices.create({
                product: product.id,
                unit_amount: Math.floor(parseInt(pkg.price) * 100),
                currency: "usd",
                recurring: { interval: "month" },
            });
            line_items.push({
                price: price.id,
                quantity: 1,
                tax_rates: [null],
            });
            // handle tax
            const taxRate = yield stripe.taxRates.create({
                display_name: "Tax",
                description: "Sales Tax",
                jurisdiction: "GA",
                percentage: `${taxPercent}`,
                inclusive: false,
            });
            for (let i = 0; i < line_items.length; i++) {
                line_items[i].tax_rates = [taxRate.id];
            }
            try {
                // create stripe sesssion
                const session = yield stripe.checkout.sessions.create({
                    payment_method_types: ["card"],
                    line_items,
                    mode: "subscription",
                    success_url: `${url}/page/success?session_id={CHECKOUT_SESSION_ID}`,
                    cancel_url: `${url}/`,
                });
                return { session: session.id };
            }
            catch (err) {
                throw new Error("Session Failed.");
            }
        }),
    },
};
exports.default = resolvers;

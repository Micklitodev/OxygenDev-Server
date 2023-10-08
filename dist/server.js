"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const connection_1 = __importDefault(require("./config/connection"));
const graphql_1 = require("./graphql");
const auth_1 = require("./utils/auth");
const server = new apollo_server_1.ApolloServer({
    typeDefs: graphql_1.typeDefs,
    resolvers: graphql_1.resolvers,
    context: auth_1.authMiddleware,
});
connection_1.default.once("open", () => {
    console.log("sucess");
    return server.listen({ port: 4000 });
});

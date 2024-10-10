import { ApolloServer } from "apollo-server";
import db from "./config/connection";
import { typeDefs, resolvers } from "./graphql";
import { authMiddleware } from "./utils/auth";

const PORT = process.env.PORT || 4000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

db.once("open", (e) => {
  console.log("error/connected", e);
  return server.listen({ port: PORT });
});

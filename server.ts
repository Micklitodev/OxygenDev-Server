import { ApolloServer } from "apollo-server";
import db from "./config/connection";
import { typeDefs, resolvers } from "./graphql";
import { authMiddleware } from "./utils/auth";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

db.once("open", () => {
  console.log("sucess");
  return server.listen({ port: 4000 });
});

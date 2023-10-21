"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const typeDefs = (0, apollo_server_1.gql) `
  type User {
    _id: ID
    firstName: String
    lastName: String
    email: String
  }

  type Checkout {
    session: ID
  }

  type Auth {
    token: ID
    user: User
  }

  type Pkg {
    _id: ID
    name: String
    price: Float
    popular: Boolean
    features: [String]
  }

  type Query {
    user: User
    getPkg: [Pkg]
  }

  type Mutation {
    addUser(
      firstName: String!
      lastName: String!
      email: String!
      password: String!
    ): Auth

    login(email: String!, password: String!): Auth

    checkoutSess(pkg: [ID]!): Checkout
  }
`;
exports.default = typeDefs;

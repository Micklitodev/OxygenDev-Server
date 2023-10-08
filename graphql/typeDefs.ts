import { gql } from "apollo-server";

const typeDefs = gql`
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
    features: [String]
  }

  type Query {
    user: User
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

export default typeDefs;

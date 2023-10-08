import { AuthenticationError } from "apollo-server";
import { User } from "../models";

import { signToken } from "../utils/auth";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const resolvers = {
  Query: {
    user: async (_: any, args: any, context: any) => {
      if (context.user) {
        try {
          const user = await User.findById(context.user._id);
          return user;
        } catch (err) {
          return console.log(err);
        }
      } else {
        throw new AuthenticationError("Not logged in");
      }
    },
  },

  Mutation: {
    addUser: async (_: any, args: any) => {
      if (args.password.length < 5) {
        throw new AuthenticationError("Password is not long enough.");
      }

      if (!emailRegex.test(args.email)) {
        throw new AuthenticationError("Email is not in the correct format.");
      }

      try {
        const user: any = await User.create(args);
        const token = signToken(user);

        return { token, user };
      } catch (err) {
        throw new AuthenticationError("Account already exists.");
      }
    },

    login: async (_: any, args: any) => {
      const { email, password } = args;

      if (!emailRegex.test(email)) {
        throw new AuthenticationError("Email is not in the correct format");
      }
      const user: any = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);

      if (!token) {
        throw new AuthenticationError("Incorrect credentials");
      }

      return { token, user };
    },
  },
};

export default resolvers;

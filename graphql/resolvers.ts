import { AuthenticationError } from "apollo-server";
import { User, Pkg } from "../models";
import { signToken } from "../utils/auth";
import { Users, Context, UserUpdate, TokenWithUser, Pkgs } from "../lib/types";
import stripe from "../client/stripe";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const taxPercent = 8.75;

const resolvers = {
  Query: {
    user: async (_: any, args: any, context: Context): Promise<Users & any> => {
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
    getPkg: async (): Promise<Pkgs[]> => {
      return await Pkg.find();
    },
  },
  Mutation: {
    addUser: async (_: any, args: Users): Promise<TokenWithUser> => {
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

    login: async (_: any, args: UserUpdate): Promise<TokenWithUser> => {
      const { email, password } = args;

      if (!emailRegex.test(email!)) {
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
    checkoutSess: async (
      _: any,
      args: any,
      context: Context
    ): Promise<{ session: string }> => {
      if (context.user) {
        throw new Error("Not logged in");
      }
      const url = "http://localhost:3000";

      const line_items: {
        price: string;
        quantity: number;
        tax_rates: string[];
      }[] = [];

      const pkg: any = await Pkg.findById(args.pkg);

      const product = await stripe.products.create({
        name: pkg.name,
        description: pkg.description,
        images: [`${pkg.image}`],
      });

      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: Math.floor(parseInt(pkg.price) * 100),
        currency: "usd",
        recurring: { interval: "month" },
      });

      line_items.push({
        price: price.id,
        quantity: 1,
        tax_rates: [],
      });

      const taxRate = await stripe.taxRates.create({
        display_name: "Tax",
        description: "Sales Tax",
        jurisdiction: "GA",
        percentage: taxPercent,
        inclusive: false,
      });

      for (let i = 0; i < line_items.length; i++) {
        line_items[i].tax_rates = [taxRate.id];
      }

      try {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items,
          mode: "subscription",
          success_url: `${url}/page/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${url}/`,
        });

        return { session: session.id };
      } catch (err) {
        throw new Error("Session Failed.");
      }
    },
  },
};

export default resolvers;

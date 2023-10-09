import { AuthenticationError } from "apollo-server";
import { User, Pkg } from "../models";
import { signToken } from "../utils/auth";
import { config } from "dotenv";
config();

const stripeapi = process.env.STRIPE_KEY;
const stripe = require("stripe")(stripeapi);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const taxPercent = 8.75;

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
    checkoutSess: async (_: any, args: any, context: any) => {
      if (context.user) {
        throw new Error("Not logged in");
      }

      // const url = new URL(context.headers.referer).origin;
      const url = "http://localhost:3000";

      const line_items = [];

      // push each product as line item
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
        tax_rates: [null],
      });

      // handle tax

      const taxRate = await stripe.taxRates.create({
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

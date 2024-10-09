import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://mongo-db:27017/graphql-test")
  .then(() => {
    console.log("data connected to db ");
  });

export default mongoose.connection;

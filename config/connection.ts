import mongoose from "mongoose";

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_DB_URI || "mongodb://mongo-db:27017/graphql-test")
  .then(() => {
    console.log("data connected to db ");
  });

export default mongoose.connection;

import mongoose from "mongoose";

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://mongo-db:27017/graphql-test").then((e) => {
  console.log("error/connected", e);
});

export default mongoose.connection;

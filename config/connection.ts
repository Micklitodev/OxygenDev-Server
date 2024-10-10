import mongoose from "mongoose";

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://@mongo:27017/graphql-test").then((e) => {
  console.log("error/connected", e);
});

export default mongoose.connection;

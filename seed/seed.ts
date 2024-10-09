import db from "../config/connection";
import { User, Pkg } from "../models";
import { pkgsData, userData } from "./data";

db.once("open", async () => {
  await User.insertMany(userData);
  await Pkg.insertMany(pkgsData);

  console.log("all done!");
  process.exit(0);
});

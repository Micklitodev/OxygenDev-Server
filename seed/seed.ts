import db from "../config/connection";
import { User, Pkg } from "../models";
import userData from "./userdata.json";
import pkgData from "./pkgdata.json";

db.once("open", async () => {
  await User.insertMany(userData);
  await Pkg.insertMany(pkgData);

  console.log("all done!");
  process.exit(0);
});

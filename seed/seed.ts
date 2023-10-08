import db from "../config/connection";
import { User } from "../models";
import userData from "./userdata.json";

db.once("open", async () => {
  await User.insertMany(userData);

  console.log("all done!");
  process.exit(0);
});

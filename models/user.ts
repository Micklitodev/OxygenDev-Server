import { Schema, model } from "mongoose";

import argon2 from "argon2";

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
});

userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    this.password = await argon2.hash(this.password);
  }

  next();
});

userSchema.methods.isCorrectPassword = async function (password: any) {
  return await argon2.verify(this.password, password);
};

const User = model("User", userSchema);

export default User;

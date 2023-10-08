import { Schema, model } from "mongoose";

const PkgSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0.99,
  },
  features: [
    {
      type: String,
      required: true,
      trim: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Pkg = model("Pkg", PkgSchema);

export default Pkg;

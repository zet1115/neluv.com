import mongoose, { Schema, Model, Document, Date } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    mobile: {
      type: String,
    },
  },
  { collection: "users", timestamps: true }
);

const User = mongoose.model("user", UserSchema);

export { User };

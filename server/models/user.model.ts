import mongoose, { Schema, Model, Document, Date } from "mongoose";
type UserDocument = {
  first_name: string;
  last_name:  string;
  gender: string;
  email: string;
  password: string;
  birthday?: string;
  country?:  string;
  city?: string;
  phone_number?: number;
  avatar? : string;
  about_me?: string;
  billing_data?: any; 
};

const UserSchema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required :  true
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    gender : {
      type: String,
      required:  true,
    },
    password: {
      type: String,
      required: true,
    },
    birthday: {
      type: String,
    },
    country:  {
      type: String,
    },
    city: {
      type: String,
    },
    phone_number: {
      type: Number,
    },
    avatar: {
      type: String,
    },
    about_me: {
      type: String,
    },
    billing_data : {
      credit_card_number : {
        type: Number,
      },
      holder_name : {
        type: String,
      },
      client_address : {
        type: String,
      }
    }
  },
  { collection: "users", timestamps: true }
);

const User: Model<UserDocument> = mongoose.model("user", UserSchema);

export { User, UserDocument };

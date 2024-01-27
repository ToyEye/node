import { model, Schema } from "mongoose";
import Joi from "joi";
import { handleSaveError } from "../helpers/mongooseError.js";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: { type: String, require: true, minLength: 6 },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: { type: String, default: null },
    verify: { type: Boolean, default: false },
    verifyCode: { type: String },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleSaveError);

export const signupSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

export const changeSubscribeSchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business"),
});

export const verifySchema = Joi.object({
  email: Joi.string().required(),
});

export const User = model("user", userSchema);

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { User } from "../models/users.js";
import { HttpErrors } from "../helpers/HttpErrors.js";
import { ctrlWrapper } from "../decorators/ctrlWrapper.js";

const { SECRET_KEY } = process.env;

const signUp = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    throw HttpErrors(409, "Email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...req.body, password: hashPassword });
  res.status(201).json({ subscription: "starter", email: newUser.email });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  console.log(user);

  if (!user) {
    throw HttpErrors(401, "Email or password invalid ");
  }

  const comparePassword = await bcrypt.compare(password, user.password);
  console.log(comparePassword);
  if (!comparePassword) {
    throw HttpErrors(401, "Email or password invalid ");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

  await User.findByIdAndUpdate(user._id, { token });

  res.status(200).json({
    token,
    user: { email: user.email, subscription: user.subscription },
  });
};

const getCurrent = async (req, res) => {
  const { user, email } = req.user;

  res.json({ user, email });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.json({ message: "logout success" });
};

const changeSubscription = async (req, res) => {
  const { _id } = req.user;
  const { subscription } = req.body;

  await User.findByIdAndUpdate(_id, { subscription });

  res.json({ message: "subscription changed" });
};

export default {
  signUp: ctrlWrapper(signUp),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  changeSubscription: ctrlWrapper(changeSubscription),
};

import express from "express";

const usersRoute = express.Router();
import { validateBody } from "../decorators/validateBody.js";
import * as schemas from "../models/users.js";
import authCtrl from "../controllers/auth.js";
import { isEmptyBody } from "../middlewares/isEmptyBody.js";
import { authenticate } from "../middlewares/authenticate.js";

usersRoute.post(
  "/signup",
  isEmptyBody,
  validateBody(schemas.signupSchema),
  authCtrl.signUp
);

usersRoute.post(
  "/login",
  isEmptyBody,
  validateBody(schemas.loginSchema),
  authCtrl.login
);

usersRoute.get("/current", authenticate, authCtrl.getCurrent);

usersRoute.post("/logout", authenticate, authCtrl.logout);

usersRoute.patch("/subscription", authenticate, authCtrl.changeSubscription);

export default usersRoute;

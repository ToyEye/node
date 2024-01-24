import { HttpErrors } from "../helpers/HttpErrors.js";

export const isEmptyBody = (req, res, next) => {
  const { length } = Object.keys(req.body);
  if (!length) {
    return next(HttpErrors(400, "Body must have fields"));
  }
  next();
};

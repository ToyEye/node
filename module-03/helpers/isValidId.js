import { isValidObjectId } from "mongoose";

import { HttpErrors } from "./HttpErrors.js";

export const isValidId = (req, res, next) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    next(HttpErrors(400, `${id} is not valid id`));
  }
  next();
};

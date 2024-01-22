import { HttpErrors } from "../helpers/HttpErrors.js";

export const validateBody = (schema) => {
  const func = (req, _, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      throw HttpErrors(400, error.message);
    }
    next();
  };
  return func;
};

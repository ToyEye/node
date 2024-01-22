import express from "express";

const contactRoute = express.Router();

import {
  getAllContacts,
  getContactById,
  deleteContact,
  updateContact,
  createContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";
import { isValidId } from "../helpers/isValidId.js";
import { validateBody } from "../decorators/validateBody.js";
import * as contactSchema from "../models/contactSchema.js";

contactRoute.get("/", getAllContacts);

contactRoute.get("/:id", isValidId, getContactById);

contactRoute.post(
  "/",
  validateBody(contactSchema.addContactSchema),
  createContact
);

contactRoute.delete("/:id", isValidId, deleteContact);

contactRoute.put(
  "/:id",
  isValidId,
  validateBody(contactSchema.updateContactSchema),
  updateContact
);

contactRoute.patch(
  "/:id/favorite",
  isValidId,
  validateBody(contactSchema.updateFavorite),
  updateStatusContact
);

export default contactRoute;

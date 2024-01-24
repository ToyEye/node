import express from "express";

const contactRoute = express.Router();

import contactCtrl from "../controllers/contactsControllers.js";

import { validateBody } from "../decorators/validateBody.js";
import * as contactSchema from "../models/contactSchema.js";

import { isValidId } from "../middlewares/isValidId.js";
import { isEmptyBody } from "../middlewares/isEmptyBody.js";
import { authenticate } from "../middlewares/authenticate.js";

contactRoute.use(authenticate);

contactRoute.get("/", contactCtrl.getAllContacts);

contactRoute.get("/:id", isValidId, contactCtrl.getContactById);

contactRoute.post(
  "/",
  isEmptyBody,
  validateBody(contactSchema.addContactSchema),
  contactCtrl.createContact
);

contactRoute.delete("/:id", isValidId, contactCtrl.deleteContact);

contactRoute.put(
  "/:id",
  isEmptyBody,
  isValidId,
  validateBody(contactSchema.updateContactSchema),
  contactCtrl.updateContact
);

contactRoute.patch(
  "/:id/favorite",
  isEmptyBody,
  isValidId,
  validateBody(contactSchema.updateFavorite),
  contactCtrl.updateStatusContact
);

export default contactRoute;

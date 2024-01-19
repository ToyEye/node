import express from "express";
import {
  getAllContacts,
  getContactById,
  deleteContact,
  createContact,
  updateContact,
} from "../controllers/contactsControllers.js";

const contactsRouter = express.Router();

import * as schemas from "../schemas/contactsSchemas.js";
import validateBody from "../helpers/validateBody.js";

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getContactById);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post(
  "/",
  validateBody(schemas.createContactSchema),
  createContact
);

contactsRouter.put(
  "/:id",
  validateBody(schemas.updateContactSchema),
  updateContact
);

export default contactsRouter;

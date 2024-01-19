import * as contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await contactsService.listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getContactById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const contact = await contactsService.getContactById(id);

    if (!contact) {
      throw HttpError(404);
    }

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedContact = await contactsService.removeContact(id);

    if (!deletedContact) {
      throw HttpError(404);
    }

    res.status(200).json(deletedContact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  const { name, email, phone } = req.body;

  try {
    const newContact = await contactsService.addContact(name, email, phone);

    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  if (Object.values(req.body).length === 0) {
    res.status(400).json({ message: "Body must have at least one field" });
  }
  try {
    const updatedContact = await contactsService.updateContact(
      req.params.id,
      req.body
    );
    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};

export {};

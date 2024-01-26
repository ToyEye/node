import { HttpErrors } from "../helpers/HttpErrors.js";
import { Contact } from "../models/contactSchema.js";
import { ctrlWrapper } from "../decorators/ctrlWrapper.js";

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;

  const { page, limit } = req.query;

  const skip = (page - 1) * limit;

  const contacts = await Contact.find({ owner }, "-updatedAt -createdAt", {
    skip,
    limit,
  }).populate("owner", "name email");
  res.status(200).json(contacts);
};

const getContactById = async (req, res) => {
  const { id } = req.params;

  const contact = await Contact.findById(id);

  if (!contact) {
    throw HttpErrors(404);
  }

  res.status(200).json(contact);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;

  const contact = await Contact.findByIdAndDelete(id);

  if (!contact) {
    throw HttpErrors(404);
  }
  res.status(200).json({ message: "deleting successful" });
};

const createContact = async (req, res) => {
  const { _id: owner } = req.user;

  const newContact = await Contact.create({ ...req.body, owner });
  res.status(201).json(newContact);
};

const updateContact = async (req, res) => {
  const { id } = req.params;

  const updatedContact = await Contact.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  res.json(updatedContact);
};

const updateStatusContact = async (req, res) => {
  const { id } = req.params;

  if (!req.body) {
    res.status(400).json({ message: "missing field favorite" });
  }

  const updatedContact = await Contact.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  res.json(updatedContact);
};

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getContactById: ctrlWrapper(getContactById),
  deleteContact: ctrlWrapper(deleteContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};

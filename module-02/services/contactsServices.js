import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { nanoid } from "nanoid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const contactPath = path.join(__dirname, "../db/contacts.json");

async function listContacts() {
  try {
    const contacts = await fs.readFile(contactPath);

    return JSON.parse(contacts.toString());
  } catch (error) {
    return console.log(error.message);
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await listContacts();

    const contact = contacts.find((contact) => contact.id === contactId);

    if (contact) return contact;

    return null;
  } catch (error) {
    return console.log(error.message);
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await listContacts();

    const contact = contacts.findIndex((contact) => contact.id === contactId);

    if (contact === -1) {
      return null;
    }
    const removedContact = contacts.splice(contact, 1)[0];

    const updatecontacts = JSON.stringify(contacts, null, 2);

    await fs.writeFile(contactPath, updatecontacts);

    return removedContact;
  } catch (error) {
    return console.log(error.message);
  }
}

async function addContact(name, email, phone) {
  const newContact = { name, email, phone, id: nanoid() };
  try {
    const contacts = await listContacts();
    contacts.push(newContact);

    await fs.writeFile(contactPath, JSON.stringify(contacts, null, 2));

    return newContact;
  } catch (error) {
    return console.log(error.message);
  }
}

async function updateContact(id, data) {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === id);

  try {
    if (index === -1) return null;
    contacts[index] = { id, ...data };
    await fs.writeFile(contactPath, JSON.stringify(contacts, null, 2));

    return contacts[index];
  } catch (error) {
    return console.log(error.message);
  }
}

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};

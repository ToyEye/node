const fs = require("fs/promises");
const path = require("path");

const contactPath = path.join(__dirname, "db/contacts.json");

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
    const contacts = await fs.readFile(contactPath);

    const parsedContacts = JSON.parse(contacts.toString());
    const contact = parsedContacts.find((contact) => contact.id === contactId);

    if (contact) return contact;

    return null;
  } catch (error) {
    return console.log(error.message);
  }
}

async function removeContact(contactId) {
  try {
    const contacts = JSON.parse((await fs.readFile(contactPath)).toString());

    const contact = contacts.findIndex((contact) => contact.id === contactId);
    console.log(contact);

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
  const newContact = { name, email, phone, id: new Date() };
  try {
    const contacts = JSON.parse((await fs.readFile(contactPath)).toString());
    contacts.push(newContact);

    await fs.writeFile(contactPath, JSON.stringify(contacts, null, 2));

    return newContact;
  } catch (error) {
    return console.log(error.message);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};

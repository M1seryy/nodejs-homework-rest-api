const fs = require("fs/promises");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const listContacts = async () => {
  return await fs.readFile(`${__dirname}/contacts.json`, "utf-8");
};

const getContactById = async (contactId) => {
  const db = await fs
    .readFile(`${__dirname}/contacts.json`, "utf-8")
    .then((data) => JSON.parse(data))
    .catch((err) => console.log(err));
  const isContactInDb = db.filter((item) => item.id === contactId);

  const [getById] = isContactInDb;
  if (isContactInDb.length !== 0) {
    return getById;
  }
  return "Not found such a contact";
};

const removeContact = async (contactId) => {
  const db = await fs
    .readFile(`${__dirname}/contacts.json`, "utf8")
    .then((data) => data)
    .catch((err) => err);

  const isContactInDb = JSON.parse(db).filter((item) => item.id === contactId);

  const newArr = JSON.parse(db).filter((item) => item.id !== contactId);

  if (isContactInDb.length !== 0) {
    fs.writeFile(`${__dirname}/contacts.json`, JSON.stringify(newArr));
    return `Deleted contact ${isContactInDb}`;
  } else {
    return "There is no such id";
  }
};

const addContact = async (body) => {
  const result = await fs
    .readFile(`${__dirname}/contacts.json`, "utf8")
    .then((data) => data)
    .catch((err) => err);
  if (body.name && body.phone && body.email) {
    const newContact = {
      id: uuidv4(),
      name: body.name,
      email: body.email,
      phone: body.phone,
    };
    const arr = JSON.parse(result);
    arr.push(newContact);
    fs.writeFile(`${__dirname}/contacts.json`, JSON.stringify(arr));
    return newContact;
  } else {
    return "Fields err";
  }
};

const updateContact = async (contactId, body) => {
  const result = await fs
    .readFile(path.resolve(`${__dirname}/contacts.json`), "utf8")
    .then((data) => JSON.parse(data))
    .catch((err) => err);

  const contact = result.find((contact) => {
    if (contact.id === contactId) {
      body.name ? (contact.name = body.name) : null;
      body.email ? (contact.email = body.email) : null;
      body.phone ? (contact.phone = body.phone) : null;
      return contact;
    }
  });

  fs.writeFile(`${__dirname}/contacts.json`, JSON.stringify(result));
  return contact;
};



module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};

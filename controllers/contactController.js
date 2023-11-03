const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../models/contacts");

const getContact = async (req, res) => {
  const response = await listContacts();
  res.json({ data: JSON.parse(response) });
};

const getById = async (req, res) => {
  const { contactId } = req.params;
  const response = await getContactById(contactId);
  res.status(200).json({
    data: response,
  });
};

const createContact = async (req, res) => {
  const { name, phone, email } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({
      message: "Fields error",
    });
  } else {
    const newContact = await addContact({ name, phone, email });
    res.status(200).json({
      data: newContact,
    });
  }
};

const deleteContact = async (req, res, next) => {
  const { contactId } = req.params;
  await removeContact(contactId);
  const result = await removeContact(contactId);
  res.status(204).json({
    data: result,
  });
};

const putContact = async (req, res, next) => {
  const { name, phone, email } = req.body;
  const { contactId } = req.params;
  console.log("req.body", req.body);
  console.log("contactId", contactId);
  if (name && email && phone) {
    res.json({
      status: "success",
      code: 200,
      data: await updateContact(contactId, { name, phone, email }),
    });
  } else {
    res.status(400).json({
      message: "not found",
    });
  }
};

module.exports = {
  getContact,
  getById,
  createContact,
  deleteContact,
  putContact,
};

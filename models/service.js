const contacts = require("./contatacSchema");

const getAlltasks = async () => {
  const findContacts = await contacts.find({});
  return findContacts;
};

const getTaskById = async (id) => {
  const byId = await contacts.findOne({ _id: id });
  return byId;
};

module.exports = {
  getAlltasks,
  getTaskById,
};

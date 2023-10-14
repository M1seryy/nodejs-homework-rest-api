const contacts = require("./contatacSchema");

const getAlltasks = async () => {
  const findContacts = await contacts.find({});
  return findContacts;
};

const getTaskById = async (id) => {
  const byId = await contacts.findOne({ _id: id });
  return byId;
};

const createTask = ({ name, email, phone }) => {
  return contacts.create({ name, email, phone });
};

const removeTask = (id) => {
  return contacts.findByIdAndRemove({ _id: id });
};

const updateTask = (id, fields) => {
  return contacts.findByIdAndUpdate({ _id: id }, fields);
};

module.exports = {
  getAlltasks,
  getTaskById,
  createTask,
  removeTask,
  updateTask
};

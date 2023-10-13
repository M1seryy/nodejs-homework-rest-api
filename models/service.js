const contacts = require("./contatacSchema");

const getAlltasks = async () => {
  const findContacts = await contacts.find({});
  return findContacts;
};
module.exports = {
  getAlltasks,
};

const userSchema = require("../../models/userModel");
const createUser = ({ email, password }) => {
  return userSchema.create({ email, password });
};
module.exports = {
  createUser,
};

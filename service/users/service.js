const userSchema = require("../../models/userModel");
const createUser = ({ email, password ,verificationToken}) => {
  return userSchema.create({ email, password,verificationToken });
};
module.exports = {
  createUser,
};

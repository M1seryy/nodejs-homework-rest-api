const jwt = require("jsonwebtoken");
const scheme = require("../models/contatacSchema");
const isId = async (req, res, next) => {
  const { contactId } = req.params;
  const isUserValid = await scheme.findOne({ _id: contactId });
  if (isUserValid) {
    next();
  } else {
    res.status(404).send("Not found");
  }
};

module.exports = isId;

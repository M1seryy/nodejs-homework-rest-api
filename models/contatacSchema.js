const { Schema, model } = require("mongoose");
const contact = new Schema(
  {
    name: { type: String, require: true },
    email: { type: String, require: true },
    phone: { type: String, require: true },
  },
  { versionKey: false, timestamps: true }
);
const Contact = model("contacts", contact);

module.exports = Contact;

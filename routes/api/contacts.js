const express = require("express");
const controller = require("../../models/controllers");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../../models/contacts");

const router = express.Router();
router.get("/", controller.get);
// router.get("/", async (req, res, next) => {
//   listContacts()
//     .then((data) => res.json({ data: JSON.parse(data) }))
//     .catch((err) => console.log(err));
// });

router.get("/:contactId", async (req, res) => {
  const { contactId } = req.params;
  const response = await getContactById(contactId);
  res.status(200).json({
    data: response,
  });
});

router.post("/", async (req, res, next) => {
  const { name, phone, email } = req.body;
  const newContact = await addContact({ name, phone, email });

  res.status(200).json({
    data: newContact,
  });
});

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  await removeContact(contactId);
  const result = await removeContact(contactId);
  res.status(204).json({
    data: result,
  });
});

router.put("/:contactId", async (req, res, next) => {
  const { name, phone, email } = req.body;
  const { contactId } = req.params;
  console.log("req.body", req.body);
  console.log("contactId", contactId);
  if (Object.keys(req.body).length) {
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
});

module.exports = router;

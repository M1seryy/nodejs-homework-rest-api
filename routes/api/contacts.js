const express = require("express");

const controller = require("../../controllers/contactController.js");

const router = express.Router();
router.get("/", controller.getContact);

router.get("/:contactId", controller.getById);

router.post("/", controller.createContact);

router.delete("/:contactId", controller.deleteContact);

router.put("/:contactId", controller.putContact);

module.exports = router;

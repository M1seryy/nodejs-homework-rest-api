const express = require("express");
const controller = require("../../models/controllers");


const router = express.Router();
router.get("/", controller.get);

router.get("/:contactId", controller.getById);

router.post("/", controller.create);

router.delete("/:contactId", controller.remove);

router.put("/:contactId", controller.updateStatus);

module.exports = router;

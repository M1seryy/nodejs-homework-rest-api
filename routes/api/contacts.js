const express = require("express");
const controller = require("../../controllers/contact/controllers");
const isId = require("../../middleware/isId");

const router = express.Router();
router.get("/", controller.get);

router.get("/:contactId", isId, controller.getById);

router.post("/", controller.create);

router.delete("/:contactId", isId, controller.remove);

router.put("/:contactId", isId, controller.updateStatus);
router.patch("/:contactId/favorite", isId, controller.addToFav);

module.exports = router;

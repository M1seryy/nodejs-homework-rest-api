const express = require("express");
const path = require("path");
const router = express.Router();
const controller = require("../../controllers/user/controllers");
const isAuth = require("../../middleware/auth");
const upload = require("../../middleware/upload");

router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/current", isAuth, controller.current);
router.post("/logout", isAuth, controller.logout);
router.get("/verify/:verifyToken",controller.verify);
router.patch("/uploads", isAuth, upload.single("picture"), controller.patchImg);

module.exports = router;

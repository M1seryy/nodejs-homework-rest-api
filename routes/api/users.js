const express = require("express");

const router = express.Router();
const controller = require("../../controllers/user/controllers");
const isAuth = require("../../middleware/auth");
router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/current", isAuth, controller.current);
router.post("/logout", isAuth, controller.logout);
module.exports = router;

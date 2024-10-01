const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
router.get("/", () => {});

router.post("/login");

router.post("/signup", userController.signup);

module.exports = router;

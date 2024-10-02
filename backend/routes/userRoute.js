const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware=require('../middlewares/authMiddleware')
router.get("/",authMiddleware,userController.AllUsers);

router.get("/user/:username", userController.UserByUsername);

module.exports = router;

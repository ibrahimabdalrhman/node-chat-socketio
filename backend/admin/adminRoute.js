const express = require("express");
const router = express.Router();
const adminController = require("../admin/adminController");
const authMiddleware=require('../middlewares/authMiddleware');

router.get("/users",authMiddleware,adminController.AllUsers);
router.get("/users/:username",authMiddleware,adminController.UserByUsername);


module.exports = router;

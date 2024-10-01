const User = require("../models/userModel");
const generateToken=require('../config/generateToken')
// {
//     name: "Alice Johnson",
//     username: "alicejohnson",
//     email: "alice@example.com",
//     password: "password123",
// }
exports.signup = async (req, res) => {
  const { name, username, email, password } = req.body;  
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User Already exists");
  }
  const user = await User.create({ name, username, email, password });
  if (user) {
    return res.status(201).json({
      msg: "created new user",
      data: user,
      token :generateToken(user._id.toString())
    });
  }
  res.status(400);
    throw new Error("Failed to Create New User");
};




const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

//api/user/
exports.AllUsers = asyncHandler(async (req, res, next) => {
  const search = req.query.search; // get the search query

  if (!search || search.trim() === "") {
    return res.status(200).json({
      msg: "Search for users by Username or Name",
    });
  }

  const keyword = {
    $or: [
      {
        name: { $regex: search, $options: "i" },
      },
      {
        username: { $regex: search, $options: "i" },
      },
    ],
  };
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.status(200).json({
    data: users,
  });
});

exports.UserByUsername = asyncHandler(async (req, res, nest) => {
  const username = req.params.username;
  const user = await User.findOne({ username });
  res.status(200).json({
    data: user,
  });
});

exports.profile = asyncHandler(async (req, res, nest) => {
  const username = req.user.username;
  const user = await User.findOne({ username });
  res.status(200).json({
    data: user,
  });
});

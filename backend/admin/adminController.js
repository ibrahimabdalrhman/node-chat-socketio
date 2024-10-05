const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

//api/user/
exports.AllUsers = asyncHandler(async (req, res, next) => {
  let search = req.query.search; // get the search query
  if (!search) {
    search=""
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
  const users = await User.find(keyword);
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

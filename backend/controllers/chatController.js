const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const ApiError = require("../utils/apiError");

exports.accessChat = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).send({ message: "UserId not provided" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return next(new ApiError("user not found", 404));
  }

  let chat = await Chat.find({
    isGroup: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessages");
  if (chat.length > 0) {
    return res.status(200).json({
      chat: chat[0],
    });
  }

  const chatName = user.name;

  const newChat = await Chat.create({
    chatName,
    users: [userId, req.user._id],
  });
  const fullChat = await Chat.findById(newChat._id).populate(
    "users",
    "-password"
  );
  return res.status(200).json({
    chat: fullChat,
  });

});

exports.fetchChats = asyncHandler(async (req, res, next) => {});

exports.createGroup = asyncHandler(async (req, res, next) => {});

exports.renameGroup = asyncHandler(async (req, res, next) => {});

exports.RemoveGroup = asyncHandler(async (req, res, next) => {});

exports.addToGroup = asyncHandler(async (req, res, next) => {});

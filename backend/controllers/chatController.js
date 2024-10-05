const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const ApiError = require("../utils/apiError");

exports.accessChat = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "UserId not provided" });
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

exports.fetchChats = asyncHandler(async (req, res, next) => {
  const chats = await Chat.find({
    users: { $elemMatch: { $eq: req.user._id } },
  })
    .populate("users", "-password")
    .populate("latestMessages");

  res.status(200).json({
    chats,
  });
});

exports.createGroup = asyncHandler(async (req, res, next) => {
  const { chatName, users } = req.body;
  if (!chatName || !users) {
    return next(new ApiError("Please fill all the fields", 400));
  }
  const validUsers = [];

  for (const userId of users) {
    const validUser = await User.findById(userId);
    if (!validUser) {
      return next(new ApiError(`User ID ${userId} not found`, 404));
    }
    validUsers.push(validUser._id);
  }
  validUsers.push(req.user._id);
  const group = await Chat.create({
    chatName: chatName,
    isGroup: true,
    users: validUsers,
    groupAdmin: req.user._id,
  });
  const fullGroupChat = await Chat.findOne({ _id: group._id })
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  res.status(200).json(fullGroupChat);
});

exports.renameGroup = asyncHandler(async (req, res, next) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  res.status(200).json(updatedChat);
});

exports.addToGroup = asyncHandler(async (req, res, next) => {
  const { chatId, userId } = req.body;

  if (!chatId || !userId) {
    return next(new ApiError("Chat ID and User ID are required", 400));
  }

  const chatGroup = await Chat.findById(chatId);

  if (!chatGroup) {
    return next(new ApiError("Chat group not found", 404));
  }

  if (chatGroup.users.includes(userId)) {
    return next(new ApiError("User already exists in the group", 400));
  }

  if (chatGroup.groupAdmin.toString() !== req.user._id.toString()) {
    return next(new ApiError("Only the group admin can remove users", 403));
  }

  chatGroup.users.push(userId);
  await chatGroup.save();
  const updatedGroupChat = await Chat.findById(chatId)
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  res.status(200).json(updatedGroupChat);
});

exports.removeUserFromGroup = asyncHandler(async (req, res, next) => {
  const { chatId, userId } = req.body;

  if (!chatId || !userId) {
    return next(new ApiError("Chat ID and User ID are required", 400));
  }

  const chatGroup = await Chat.findById(chatId);
  if (!chatGroup) {
    return next(new ApiError("Chat group not found", 404));
  }

  if (!chatGroup.users.includes(userId)) {
    return next(new ApiError("User is not in the group", 400));
  }

  if (chatGroup.groupAdmin.toString() !== req.user._id.toString()) {
    return next(new ApiError("Only the group admin can remove users", 403));
  }

  chatGroup.users = chatGroup.users.filter(
    (user) => user.toString() !== userId
  );
  await chatGroup.save();

  const updatedGroupChat = await Chat.findById(chatId)
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  res.status(200).json(updatedGroupChat);
});

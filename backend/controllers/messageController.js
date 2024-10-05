const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");
const ApiError = require("../utils/apiError");

exports.sendMessage = asyncHandler(async (req, res, next) => {
  const { chatId, content } = req.body;

  if (!content || !chatId) {
    return next(new ApiError("Invalid data provided", 400));
  }

  const chat = await Chat.findById(chatId);
  if (!chat) {
    return next(new ApiError("Chat not found", 404));
  }

  const message = await Message.create({
    sender: req.user._id,
    content,
    chat: chatId,
  });

  chat.latestMessages = message._id;
  await chat.save();

  const fullMessage = await Message.findById(message._id)
    .populate("sender", "name avatar")
    .populate("chat");

  res.status(201).json(fullMessage);
});

exports.getMessages = asyncHandler(async (req, res, next) => {
  const { chatId } = req.params;

  const chat = await Chat.findById(chatId);
  if (!chat) {
    return next(new ApiError("Chat not found", 404));
  }
  if (!chat.users.includes(req.user._id)) {
    return next(new ApiError("Chat not found", 404));
  }

  const messages = await Message.find({ chat: chatId })
    .populate("sender", "name avatar")
    .populate("chat");

  res.status(200).json(messages);
});

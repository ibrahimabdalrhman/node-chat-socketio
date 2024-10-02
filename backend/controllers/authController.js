const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const cloudinary = require("../config/cloudinary"); // cloudinary config
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "avatars",
    allowedFormats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage: storage });

exports.signup = [
  upload.single("avatar"), // handle file upload
  asyncHandler(async (req, res, next) => {
    const { name, username, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User Already exists");
    }

    // Avatar is uploaded to Cloudinary and the URL is available in req.file.path
    const avatarUrl = req.file ? req.file.path : undefined;

    const user = await User.create({
      name,
      username,
      email,
      password,
      avatar: avatarUrl, // Save the avatar URL
    });

    if (user) {
      return res.status(201).json({
        msg: "created new user",
        data: user,
        token: generateToken(user._id.toString()),
      });
    }
    return next(new ApiError("Failed to Create New User", 400));
  }),
];

exports.login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("email not found", 200));
  }
  const match = await user.comparePassword(req.body.password);
  if (match) {
    const token = generateToken(user._id.toString());
    return res.status(200).json({
      status: "true",
      message: `${user.name} logged in successfully`,
      user: user,
      token: token,
    });
  }
  return next(new ApiError("password incorrect", 200));
});

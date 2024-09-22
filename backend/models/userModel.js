const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

// User Schema
const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://i0.wp.com/crawleydistrictscouts.co.uk/wp-content/uploads/2021/06/413-4139803_unknown-profile-profile-picture-unknown.jpg?ssl=1", // URL or path to the user's profile picture (optional)
    },
    roles: {
      type: [String],
      enum: ["user", "admin"],
      default: ["user"],
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving the user
UserSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare password for login
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Export the User model
module.exports = mongoose.model("User", UserSchema);

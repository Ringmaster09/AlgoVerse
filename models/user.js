const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require("node:crypto");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    salt: {
      type: String,
    },

    password: {
      type: String,
      required: true,
    },

    profileImageURL: {
      type: String,
      default: "/images/user.png",
    },

    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

// 🔑 Hash password before saving
userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  const salt = randomBytes(16).toString("hex");
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  user.salt = salt;
  user.password = hashedPassword;

  next();
});

// 🔐 Static method for login
userSchema.statics.matchPassword = async function (email, plainPassword) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  // Hash the given plain password with stored salt
  const userProvidedHash = createHmac("sha256", user.salt)
    .update(plainPassword)
    .digest("hex");

  if (userProvidedHash !== user.password) {
    throw new Error("Incorrect password");
  }

  // Return user object without sensitive fields
  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.salt;

  return userObj;
};

const User = model("User", userSchema);
module.exports = User;

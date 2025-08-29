const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["USER", "ADMIN"], default: "USER" }
}, { timestamps: true });

// hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// check password
userSchema.statics.matchPassword = async function (email, plainPassword) {
  const user = await this.findOne({ email });
  if (!user) throw new Error("User not found");

  const match = await bcrypt.compare(plainPassword, user.password);
  if (!match) throw new Error("Incorrect password");

  return user;
};

module.exports = model("User", userSchema);

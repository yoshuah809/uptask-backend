import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema(
  {
    username: {
      type: "string",
      required: true,
      trim: true,
    },
    password: {
      type: "string",
      required: true,
      trim: true,
    },
    email: {
      type: "string",
      required: true,
      trim: true,
      unique: true,
    },
    token: {
      type: "string",
    },
    confirm: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  // Hash password
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;

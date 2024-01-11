import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: [
    {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
  ],
  email: [
    {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
  ],
  password: [
    {
      type: String,
      required: true,
    },
  ],
  salt: [
    {
      type: String,
      required: true,
    },
  ],
  role: [
    {
      type: String,
      required: true,
      enum: ["admin", "user"],
      default: "user",
    },
  ],
});

export default mongoose.model("User", userSchema);
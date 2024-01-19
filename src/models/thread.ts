import mongoose from "mongoose";
import { ThreadType } from "../enums/enum";

const threadSchema = new mongoose.Schema({
  parents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],
  poster: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: false,
    trim: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: Object.values(ThreadType),
  },
  replies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],
  upvotes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  bookmarks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  downvotes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model("Thread", threadSchema);

import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  content: [
    {
      type: String,
      required: true,
      trim: true,
    },
  ],
  poster: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  upvotes: [
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
  replies : [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

export default mongoose.model("Comment", commentSchema);
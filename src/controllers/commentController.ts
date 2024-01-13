import { Request, Response } from "express";
import mongoose from "mongoose";
import Comment from "../models/comment";

const getAllComments = async (req: Request, res: Response) => {
  try {
    const comments = await Comment.find({});
    return res.status(200).json({ success: true, data: comments });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
};

const getSingleComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const comment = await Comment.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: "comments",
          localField: "replies",
          foreignField: "_id",
          as: "replies",
        },
      },
    ]);

    if (comment) {
      return res.status(200).json({ success: true, data: comment });
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
};

const addReply = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (comment) {
      const newComment = await Comment.create(req.body);
      await newComment.save();

      comment.replies.push(newComment._id);
      await comment.save();

      return res.status(201).json({ success: true, data: comment });
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
};

export { getAllComments, addReply, getSingleComment };

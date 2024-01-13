import { Request, Response } from "express";
import Thread from "../models/thread";
import Comment from "../models/comment";
import mongoose from "mongoose";

const getSingleThread = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const thread = await Thread.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: "comments",
          localField: "comments",
          foreignField: "_id",
          as: "comments",
        },
      },
    ]);

    if (thread) {
      return res.status(200).json({ success: true, data: thread });
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
};

const getAllThreads = async (req: Request, res: Response) => {
  try {
    const threads = await Thread.find({});
    return res.status(200).json({ success: true, data: threads });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
};

const addThread = async (req: Request, res: Response) => {
  try {
    const thread = await Thread.create(req.body);
    return res.status(201).json({ success: true, data: thread });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
};

const addComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const thread = await Thread.findById(id);

    if (thread) {
      const newComment = await Comment.create(req.body);
      await newComment.save();

      thread.comments.push(newComment._id);
      await thread.save();

      return res.status(201).json({ success: true, data: thread });
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
};

export { getSingleThread, getAllThreads, addThread, addComment };

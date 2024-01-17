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

const upvoteDownvoteThread = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const upvote = req.body.upvote;
    const userId = req.body.id;

    const thread = await Thread.findById(id);

    if (thread) {
      if (upvote) {
        if (thread.upvotes.includes(userId)) {
          thread.upvotes = thread.upvotes.filter((upvote) => upvote !== userId);
        } else if (thread.downvotes.includes(userId)) {
          thread.downvotes = thread.downvotes.filter((downvote) => downvote !== userId);
          thread.upvotes.push(userId);
          await thread.save();
        } else {
          thread.upvotes.push(userId);
          await thread.save();
        }
        return res.status(200).json({ success: true, data: thread });
      }

      if (thread.downvotes.includes(userId)) {
        thread.downvotes = thread.downvotes.filter((downvote) => downvote !== userId);
      } else if (thread.upvotes.includes(userId)) {
        thread.upvotes = thread.upvotes.filter((upvote) => upvote !== userId);
        thread.downvotes.push(userId);
        await thread.save();
      } else {
        thread.downvotes.push(userId);
        await thread.save();
      }
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
  const payload = {
    title: req.body.title,
    content: req.body.content,
    poster: req.body.id,
  };

  try {
    const thread = await Thread.create(payload);
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

    const payload = {
      content: req.body.content,
      poster: req.body.id,
    };

    if (thread) {
      const newComment = await Comment.create(payload);
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

export { getSingleThread, upvoteDownvoteThread, getAllThreads, addThread, addComment };

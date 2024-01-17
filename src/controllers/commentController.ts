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

const upvoteDownvoteComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const upvote = req.body.upvote;
    const userId = req.body.id;

    const comment = await Comment.findById(id);

    if (comment) {
      if (upvote) {
        if (comment.upvotes.includes(userId)) {
          comment.upvotes = comment.upvotes.filter((id) => String(id) !== userId);
          await comment.save();
        } else if (comment.downvotes.includes(userId)) {
          comment.downvotes = comment.downvotes.filter((id) => String(id) !== userId);
          comment.upvotes.push(userId);
          await comment.save();
        } else {
          comment.upvotes.push(userId);
          await comment.save();
        }
        return res.status(200).json({ success: true, data: comment });
      }

      if (comment.downvotes.includes(userId)) {
        comment.downvotes = comment.downvotes.filter((id) => String(id) !== userId);
      } else if (comment.upvotes.includes(userId)) {
        comment.upvotes = comment.upvotes.filter((id) => String(id) !== userId);
        comment.downvotes.push(userId);
        await comment.save();
      } else {
        comment.downvotes.push(userId);
        await comment.save();
      }
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

    const payload = {
      content: req.body.content,
      poster: req.body.id,
    };

    const comment = await Comment.findById(id);

    if (comment) {
      const newComment = await Comment.create(payload);
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

const deleteComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);

    if (String(comment?.poster) !== req.body.id) {
      return res
        .status(403)
        .json({ success: false, error: "You are not allowed to delete this comment" });
    }
    await comment?.deleteOne();
    return res.status(200).json({ success: true, data: comment });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
};

export { getSingleComment, getAllComments, addReply, upvoteDownvoteComment, deleteComment };

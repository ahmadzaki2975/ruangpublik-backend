import { Request, Response } from "express";
import Thread from "../models/thread";
import Notification from "../models/notification";

interface INotification {
  sender: string;
  threadId: string;
  type: "upvote" | "downvote" | "broadcast";
}

const upvoteDownvoteNotification = async (props: INotification) => {
  try {
    await Notification.create(props);
  } catch (error) {
    console.error(error);
  }
};

const broadcastNotification = async (props: INotification) => {
  try {
    await Notification.create(props);
  } catch (error) {
    console.error(error);
  }
};

const createThread = async (req: Request, res: Response) => {
  const role = req.body.role;

  const payload = {
    title: req.body.title,
    content: req.body.content,
    poster: req.body.id,
    parents: [],
  };

  try {
    const thread = await Thread.create(payload);
    if (role === "admin") {
      broadcastNotification({
        sender: req.body.id,
        threadId: String(thread._id),
        type: "broadcast",
      });
    }
    return res.status(201).json({ success: true, data: thread });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
};

const createReply = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const thread = await Thread.findById(id);

    const payload = {
      content: req.body.content,
      poster: req.body.id,
      parents: thread?.parents.concat(thread._id),
    };

    if (thread) {
      const newComment = await Thread.create(payload);
      await newComment.save();

      thread.replies.push(newComment._id);
      await thread.save();

      return res.status(201).json({ success: true, data: newComment });
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
};

const deleteThread = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const thread = await Thread.findById(id);

    if (String(thread?.poster) !== req.body.id) {
      return res
        .status(403)
        .json({ success: false, error: "You are not allowed to delete this thread" });
    }
    await thread?.deleteOne();
    return res.status(200).json({ success: true, data: thread });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
};

const getSingleThread = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const thread = await Thread.findById(id);

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

const getCorrespondingReplies = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const thread = await Thread.findById(id);

    if (thread) {
      const replies = await Thread.find({ _id: { $in: thread.replies } });
      return res.status(200).json({ success: true, data: replies });
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
};

const upvoteDownvoteThread = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const upvote = req.body.upvote;
    const userId = req.body.id;

    const thread = await Thread.findById(id);

    if (thread) {
      if (upvote) {
        if (thread.upvotes.includes(userId)) {
          thread.upvotes = thread.upvotes.filter((id) => String(id) !== userId);
        } else if (thread.downvotes.includes(userId)) {
          thread.downvotes = thread.downvotes.filter((id) => String(id) !== userId);
          thread.upvotes.push(userId);
          upvoteDownvoteNotification({
            sender: userId,
            threadId: id,
            type: "upvote",
          });
        } else {
          thread.upvotes.push(userId);
          upvoteDownvoteNotification({
            sender: userId,
            threadId: id,
            type: "upvote",
          });
        }
        await thread.save();
        return res.status(200).json({ success: true, data: thread });
      }

      if (thread.downvotes.includes(userId)) {
        thread.downvotes = thread.downvotes.filter((id) => String(id) !== userId);
      } else if (thread.upvotes.includes(userId)) {
        thread.upvotes = thread.upvotes.filter((id) => String(id) !== userId);
        thread.downvotes.push(userId);
        upvoteDownvoteNotification({
          sender: userId,
          threadId: id,
          type: "downvote",
        });
      } else {
        thread.downvotes.push(userId);
        upvoteDownvoteNotification({
          sender: userId,
          threadId: id,
          type: "downvote",
        });
      }
      await thread.save();
      return res.status(200).json({ success: true, data: thread });
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
};

const bookmarkThread = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const userId = req.body.id;

    const thread = await Thread.findById(id);

    if (thread) {
      if (thread.bookmarks.includes(userId)) {
        thread.bookmarks = thread.bookmarks.filter((id) => String(id) !== userId);
      } else {
        thread.bookmarks.push(userId);
      }
      await thread.save();
      return res.status(200).json({ success: true, data: thread });
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
};

export {
  createThread,
  getSingleThread,
  getAllThreads,
  createReply,
  getCorrespondingReplies,
  deleteThread,
  bookmarkThread,
  upvoteDownvoteThread,
};

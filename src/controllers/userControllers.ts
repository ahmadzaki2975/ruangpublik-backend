import { Request, Response } from "express";
import Thread from "../models/thread";
import User from "../models/user";
import Notification from "../models/notification";
import { Role } from "../enums/enum";

const getUser = async (req: Request, res: Response) => {
  try {
    const id = req.body.id;
    const user = await User.findById(id);

    const response = {
      id: user?._id,
      fullname: user?.fullname,
      username: user?.username,
      email: user?.email,
      role: user?.role,
      nik: user?.nik,
    };

    if (user) {
      return res.status(200).json({ success: true, data: response });
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
  }
};

const editUser = async (req: Request, res: Response) => {
  try {
    const id = req.body.id;
    const role = req.body.role;
    const party = req.body.party;

    if (party && role !== Role.ADMIN) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findByIdAndUpdate(id, { $set: req.body }, { new: true });

    if (user) {
      return res
        .status(200)
        .json({ success: true, message: `User with email: ${user.email} updated`, data: user });
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = req.body.id;
    const user = await User.findById(id);

    if (String(user?._id) !== req.body.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (user) {
      await user?.deleteOne();
      return res
        .status(200)
        .json({ success: true, message: `User with email: ${user?.email} deleted` });
    }

    return res.status(404).json({ success: false, message: "User not found" });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
  }
};

const getBookmark = async (req: Request, res: Response) => {
  try {
    const threads = await Thread.find({});
    const userBookmark = threads.filter((thread) => thread.bookmarks.includes(req.body.id));
    return res.status(200).json({ success: true, data: userBookmark });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
};

const getNotification = async (req: Request, res: Response) => {
  try {
    // find all threads that the poster is the user
    const threads = await Thread.find({ poster: req.body.id });
    console.log(threads);
    if (threads) {
      // find all notifications that the postId is same as threads(array).id or notification type is broadcast
      // sort by createdAt
      const notifications = await Notification.find({
        $or: [{ threadId: { $in: threads } }, { type: "broadcast" }],
      })
        .sort({ createdAt: -1 })
        .populate("sender", "username")
        .exec();

      if (notifications.length > 5) {
        return res.status(200).json({ success: true, data: notifications.slice(0, 5) });
      }

      return res.status(200).json({ success: true, data: notifications });
    }
    return res.status(200).json({ success: true, data: [] });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
};

export { deleteUser, editUser, getAllUsers, getBookmark, getNotification, getUser };

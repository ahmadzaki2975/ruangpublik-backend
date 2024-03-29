import { Request, Response } from "express";
import Thread from "../models/thread";
import User from "../models/user";
import Notification from "../models/notification";
import { NIKVerificationStatus, Role } from "../enums/enum";

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
    const status = req.body.status;
    const nikCode = req.body.nikCode;

    const adminAction =
      status === NIKVerificationStatus.VERIFIED || status === NIKVerificationStatus.REJECTED;

    if (party && role !== Role.ADMIN) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (adminAction && role !== Role.ADMIN) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let updateObject = req.body;

    if (nikCode) {
      updateObject = {
        ...updateObject,
        "nik.nikCode": nikCode,
      };
    }

    if (status) {
      updateObject = {
        ...updateObject,
        "nik.status": status,
      };

      if (status === NIKVerificationStatus.REJECTED) {
        updateObject = {
          ...updateObject,
          "nik.is_verified": false,
        };
      } else if (status === NIKVerificationStatus.VERIFIED) {
        updateObject = {
          ...updateObject,
          "nik.is_verified": true,
        };
      }
    }

    const user = await User.findByIdAndUpdate(id, { $set: updateObject }, { new: true });

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
    const search = req.query.search as string;
    const threads = await Thread.find(search ? { title: { $regex: search, $options: "i" } } : {});
    const userBookmark = threads.filter((thread) => thread.bookmarks.includes(req.body.id));
    return res.status(200).json({ success: true, data: userBookmark });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
};

const getNotification = async (req: Request, res: Response) => {
  const query = req.query;
  const limit = Number(query.limit);

  try {
    // find all threads that the poster is the user
    const threads = await Thread.find({ poster: req.body.id });
    if (threads) {
      // find all notifications that the postId is same as threads(array).id or notification type is broadcast
      const notifications = await Notification.find({
        $or: [{ threadId: { $in: threads } }, { type: "broadcast" }],
      })
        .sort({ createdAt: -1 })
        .populate("sender", "username")
        .exec();

      if (notifications.length > limit && limit !== 0) {
        return res.status(200).json({ success: true, data: notifications.slice(0, limit) });
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

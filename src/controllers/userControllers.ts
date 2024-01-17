import { Request, Response } from "express";
import Thread from "../models/thread";
import User from "../models/user";

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
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
    const { id } = req.params;
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

const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (user) {
      return res.status(200).json({ success: true, data: user });
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
};

const getBookmarkedThreads = async (req: Request, res: Response) => {
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

// NOTE: error bang
// const login = async (req: Request, res: Response) => {
//   const { identifier, password } = req.body;
//   // identifier is either email or username
//   try {
//     const user = await User.findOne({
//       $or: [{ email: identifier }, { username: identifier }],
//     }).select("+password");
//     if (!user) {
//       return res.status(401).json({ success: false, message: "Invalid credentials" });
//     }
//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       return res.status(401).json({ success: false, message: "Invalid credentials" });
//     }
//     const token = jsonwebtoken.sign({ id: user._id }, process.env.JWT_SECRET as string, {
//       expiresIn: "1d",
//     });
//     return res.status(200).json({ success: true, token });
//   } catch (error) {
//     if (error instanceof Error) {
//       return res.status(500).json({ success: false, error: error.message });
//     }
//   }
// };

export { deleteUser, editUser, getAllUsers, getBookmarkedThreads, getUser };

import { Request, Response } from "express";
import { ReportCategory, Role } from "../enums/enum";
import Notification from "../models/notification";
import Thread from "../models/thread";
import Report from "../models/report";

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
    poster: req.body.id,
    title: req.body.title,
    content: req.body.content,
    type: req.body.type,
    parents: [],
  };

  try {
    const thread = await Thread.create(payload);
    if (role === Role.ADMIN) {
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

    if (String(thread?.poster) === req.body.id || req.body.role === Role.SUPER_ADMIN) {
      await thread?.deleteOne();
      return res.status(200).json({ success: true, data: thread });
    }
    return res
      .status(403)
      .json({ success: false, error: "You are not allowed to delete this thread" });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
};

const getSingleThread = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const thread = await Thread.findById(id).populate("poster", "username").exec();

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
    const threads = await Thread.find({})
      .populate({
        path: "poster",
        select: "username",
      })
      .exec();
    return res.status(200).json({ success: true, data: threads });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
};

const getReplyData = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const thread = await Thread.findById(id);

    if (thread) {
      const replies = await Thread.find({ _id: { $in: thread.replies } })
        .populate("poster", "username")
        .exec();
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

const reportThread = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const thread = await Thread.findById(id);

    if (thread) {
      const report = await Report.create({
        threadId: id,
        type: req.body.type,
        sender: req.body.id,
      });

      return res.status(201).json({ success: true, data: report });
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
};

// const getThreadReports = async (req: Request, res: Response) => {
//   try {
//     const id = req.params.id;
//     const thread = await Thread.findById(id);

//     if (thread) {
//       const reports = await Report.find({ threadId: id });
//       return res.status(200).json({ success: true, data: reports });
//     }

//     return res.status(404).json({ success: false, error: "Thread not found" });
//   } catch (error) {
//     if (error instanceof Error) {
//       return res.status(500).json({ success: false, error: error.message });
//     }
//   }
// };

const getReportSummary = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const thread = await Thread.findById(id);

    if (thread) {
      const reports = await Report.find({});
      const reportSummary = {
        hate: reports.filter((report) => report.type === ReportCategory.HATE).length,
        abuse_harrasment: reports.filter(
          (report) => report.type === ReportCategory.ABUSE_HARASSMENT
        ).length,
        violent_speech: reports.filter((report) => report.type === ReportCategory.VIOLENT_SPEECH)
          .length,
        spam: reports.filter((report) => report.type === ReportCategory.SPAM).length,
        privacy: reports.filter((report) => report.type === ReportCategory.PRIVACY).length,
        others: reports.filter((report) => report.type === ReportCategory.OTHERS).length,
        count: reports.length,
      };
      return res.status(200).json({ success: true, data: reportSummary });
    }

    return res.status(404).json({ success: false, error: "Thread not found" });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ success: false, error: error });
    }
  }
};

const bulkDeleteThread = async (req: Request, res: Response) => {
  const query = req.query;
  const ids = query.ids as string[];
  const deletedIds: string[] = [];

  try {
    if (req.body.role !== Role.SUPER_ADMIN) {
      return res.status(403).json({ success: false, error: "Unauthorized" });
    }

    ids.forEach(async (id: string) => {
      const thread = await Thread.findById(id);
      if (thread) {
        await thread.deleteOne();
        deletedIds.push(id);
      }
    });

    return res.status(200).json({ success: true, message: `Threads deleted: ${deletedIds}` });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
};

export {
  createReply,
  createThread,
  deleteThread,
  bulkDeleteThread,
  getAllThreads,
  getReplyData,
  getSingleThread,
  getReportSummary,
  bookmarkThread,
  reportThread,
  upvoteDownvoteThread,
};

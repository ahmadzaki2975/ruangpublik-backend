import { Router } from "express";
import {
  bookmarkThread,
  bulkDeleteThread,
  createReply,
  createThread,
  deleteThread,
  getAllThreads,
  getReplyData,
  getReportSummary,
  getSingleThread,
  reportThread,
  upvoteDownvoteThread
} from "../controllers/threadController";
import { verifyToken } from "../middleware/verifyToken";

const threadRouter = Router();

threadRouter.get("/", getAllThreads);
threadRouter.get("/:id", getSingleThread);
threadRouter.get("/:id/reply", getReplyData);
threadRouter.get("/:id/report", getReportSummary);

threadRouter.post("/", verifyToken, createThread);
threadRouter.post("/:id/reply", verifyToken, createReply);

threadRouter.put("/:id/vote", verifyToken, upvoteDownvoteThread);
threadRouter.put("/:id/bookmark", verifyToken, bookmarkThread);
threadRouter.post("/:id/report", verifyToken, reportThread);

threadRouter.delete("/:id", verifyToken, deleteThread);

/**
 * Example: /delete?ids=1&ids=2&ids=3
 * Role: ONLY super_admin
 * Usage: delete threads that violates the rules
 * */
threadRouter.delete("/delete", verifyToken, bulkDeleteThread);

export default threadRouter;

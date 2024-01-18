import { Router } from "express";
import {
  createThread,
  getSingleThread,
  getAllThreads,
  createReply,
  getCorrespondingReplies,
  deleteThread,
  bookmarkThread,
  upvoteDownvoteThread,
} from "../controllers/threadController";
import { verifyToken } from "../middleware/verifyToken";

const threadRouter = Router();

threadRouter.get("/", getAllThreads);
threadRouter.get("/:id", getSingleThread);
threadRouter.get("/:id/reply", getCorrespondingReplies);
threadRouter.post("/", verifyToken, createThread);
threadRouter.post("/:id/reply", verifyToken, createReply);
threadRouter.put("/:id/vote", verifyToken, upvoteDownvoteThread);
threadRouter.put("/:id/bookmark", verifyToken, bookmarkThread);
threadRouter.delete("/:id", verifyToken, deleteThread);

export default threadRouter;

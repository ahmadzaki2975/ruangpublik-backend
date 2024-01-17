import { Router } from "express";
import {
  addComment,
  addThread,
  bookmarkThread,
  getAllThreads,
  getSingleThread,
  upvoteDownvoteThread,
} from "../controllers/threadController";
import { verifyToken } from "../models/verifyToken";

const threadRouter = Router();

threadRouter.get("/", getAllThreads);
threadRouter.get("/:id", getSingleThread);
threadRouter.post("/", verifyToken, addThread);
threadRouter.post("/:id", verifyToken, addComment);
threadRouter.put("/:id", verifyToken, upvoteDownvoteThread);
threadRouter.put("/:id/bookmark", verifyToken, bookmarkThread);

export default threadRouter;

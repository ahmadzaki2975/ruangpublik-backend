import { Router } from "express";
import {
  addComment,
  addThread,
  getAllThreads,
  getSingleThread,
  upvoteDownvoteThread,
} from "../controllers/threadController";
import { verifyToken } from "../models/verifyToken";

const threadRouter = Router();

threadRouter.get("/", getAllThreads);
threadRouter.get("/:id", getSingleThread);
threadRouter.put("/:id", verifyToken, upvoteDownvoteThread);
threadRouter.post("/", verifyToken, addThread);
threadRouter.post("/:id", verifyToken, addComment);

export default threadRouter;

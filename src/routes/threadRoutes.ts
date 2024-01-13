import { Router } from "express";
import {
  getAllThreads,
  getSingleThread,
  addThread,
  addComment,
} from "../controllers/threadController";

const threadRouter = Router();

threadRouter.get("/", getAllThreads);
threadRouter.get("/:id", getSingleThread);
threadRouter.post("/", addThread);
threadRouter.post("/:id", addComment);

export default threadRouter;

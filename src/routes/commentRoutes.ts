import { Router } from "express";
import {
  getAllComments,
  getSingleComment,
  addReply,
  upvoteDownvoteComment,
  deleteComment,
} from "../controllers/commentController";
import { verifyToken } from "../models/verifyToken";

const commentRouter = Router();

commentRouter.get("/", getAllComments);
commentRouter.get("/:id", getSingleComment);
commentRouter.put("/:id", verifyToken, upvoteDownvoteComment);
commentRouter.post("/:id", verifyToken, addReply);
commentRouter.delete("/:id", verifyToken, deleteComment);

export default commentRouter;

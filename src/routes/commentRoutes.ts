import { Router } from "express";
import {
  getAllComments,
  getSingleComment,
  addReply,
  upvoteDownvoteComment,
  deleteComment,
} from "../controllers/commentController";

const commentRouter = Router();

commentRouter.get("/", getAllComments);
commentRouter.get("/:id", getSingleComment);
commentRouter.put("/:id", upvoteDownvoteComment);
commentRouter.post("/:id", addReply);
commentRouter.delete("/:id", deleteComment);

export default commentRouter;

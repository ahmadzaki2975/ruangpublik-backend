import { Router } from "express";
import { getAllComments, getSingleComment, addReply } from "../controllers/commentController";

const commentRouter = Router();

commentRouter.get("/", getAllComments);
commentRouter.get("/:id", getSingleComment);
commentRouter.post("/:id", addReply);

export default commentRouter;

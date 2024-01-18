import { Router } from "express";
import {
  deleteUser,
  editUser,
  getBookmark,
  getNotification,
  getUser,
} from "../controllers/userControllers";
import { verifyToken } from "../middleware/verifyToken";

const userRouter = Router();

userRouter.get("/", verifyToken, getUser);
userRouter.get("/bookmark", verifyToken, getBookmark);
userRouter.get("/notification", verifyToken, getNotification);
userRouter.put("/", verifyToken, editUser);
userRouter.delete("/", verifyToken, deleteUser);

export default userRouter;

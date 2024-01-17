import { Router } from "express";
import {
  deleteUser,
  editUser,
  getAllUsers,
  getBookmarkedThreads,
  getUser,
} from "../controllers/userControllers";
import { verifyToken } from "../models/verifyToken";

const userRouter = Router();

userRouter.get("/", getAllUsers);
userRouter.get("/bookmark", verifyToken, getBookmarkedThreads);
userRouter.get("/:id", verifyToken, getUser);
userRouter.put("/:id", verifyToken, editUser);
userRouter.delete("/:id", verifyToken, deleteUser);

export default userRouter;

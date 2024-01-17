import { Router } from "express";
import { deleteUser, editUser, getAllUsers, getUser } from "../controllers/userControllers";
import { verifyToken } from "../models/verifyToken";

const userRouter = Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:id", verifyToken, getUser);
userRouter.put("/:id", verifyToken, editUser);
userRouter.delete("/:id", verifyToken, deleteUser);

export default userRouter;

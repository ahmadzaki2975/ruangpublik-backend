import { Router } from "express";
import { deleteUser, editUser, getAllUsers, getUser } from "../controllers/userControllers";

const userRouter = Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUser);
userRouter.put("/:id", editUser);
userRouter.delete("/:id", deleteUser);

export default userRouter;

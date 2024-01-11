import { Router } from "express";
import { createUser, deleteUser, getAllUsers } from "../controllers/userControllers";

const userRouter = Router();

userRouter.get("/", getAllUsers);
userRouter.post("/", createUser);
userRouter.delete("/", deleteUser);

export default userRouter;

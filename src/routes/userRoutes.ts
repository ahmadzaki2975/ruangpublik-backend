import { Router } from "express";
import { deleteUser, getAllUsers } from "../controllers/userControllers";

const userRouter = Router();

userRouter.get("/", getAllUsers);
userRouter.delete("/", deleteUser);

export default userRouter;

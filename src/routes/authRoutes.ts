import { Router } from "express";
import { userLoginController, userSignupController } from "../controllers/authController";

const authRouter = Router();

// TODO: add oauth login
authRouter.post("/signup", userSignupController);
authRouter.post("/login", userLoginController);

export default authRouter;

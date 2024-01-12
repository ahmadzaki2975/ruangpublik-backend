import { Router } from "express";
import {
  userLoginController,
  userSignupController,
  googleAuthCallback,
  googleAuthController,
} from "../controllers/authController";

const authRouter = Router();

authRouter.post("/signup", userSignupController);
authRouter.post("/login", userLoginController);
authRouter.get("/google", googleAuthController);
authRouter.get("/google/callback", googleAuthCallback);

export default authRouter;

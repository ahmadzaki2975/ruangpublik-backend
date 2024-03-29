"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userControllers_1 = require("../controllers/userControllers");
const verifyToken_1 = require("../middleware/verifyToken");
const userRouter = (0, express_1.Router)();
userRouter.get("/", verifyToken_1.verifyToken, userControllers_1.getUser);
userRouter.get("/bookmark", verifyToken_1.verifyToken, userControllers_1.getBookmark);
userRouter.get("/notification", verifyToken_1.verifyToken, userControllers_1.getNotification);
userRouter.put("/", verifyToken_1.verifyToken, userControllers_1.editUser);
userRouter.delete("/", verifyToken_1.verifyToken, userControllers_1.deleteUser);
exports.default = userRouter;

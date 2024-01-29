"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const threadController_1 = require("../controllers/threadController");
const verifyToken_1 = require("../middleware/verifyToken");
const threadRouter = (0, express_1.Router)();
threadRouter.get("/", threadController_1.getAllThreads);
threadRouter.get("/:id", threadController_1.getSingleThread);
threadRouter.get("/:id/reply", threadController_1.getReplyData);
threadRouter.get("/:id/report", threadController_1.getReportSummary);
threadRouter.post("/", verifyToken_1.verifyToken, threadController_1.createThread);
threadRouter.post("/:id/reply", verifyToken_1.verifyToken, threadController_1.createReply);
threadRouter.put("/:id/vote", verifyToken_1.verifyToken, threadController_1.upvoteDownvoteThread);
threadRouter.put("/:id/bookmark", verifyToken_1.verifyToken, threadController_1.bookmarkThread);
threadRouter.post("/:id/report", verifyToken_1.verifyToken, threadController_1.reportThread);
threadRouter.delete("/:id", verifyToken_1.verifyToken, threadController_1.deleteThread);
/**
 * Example: /delete?ids=1&ids=2&ids=3
 * Role: ONLY super_admin
 * Usage: delete threads that violates the rules
 * */
threadRouter.delete("/delete", verifyToken_1.verifyToken, threadController_1.bulkDeleteThread);
exports.default = threadRouter;

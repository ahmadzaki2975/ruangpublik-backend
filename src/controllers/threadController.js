"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upvoteDownvoteThread = exports.reportThread = exports.bookmarkThread = exports.getReportSummary = exports.getSingleThread = exports.getReplyData = exports.getAllThreads = exports.bulkDeleteThread = exports.deleteThread = exports.createThread = exports.createReply = void 0;
const enum_1 = require("../enums/enum");
const notification_1 = __importDefault(require("../models/notification"));
const thread_1 = __importDefault(require("../models/thread"));
const report_1 = __importDefault(require("../models/report"));
const upvoteDownvoteNotification = (props) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield notification_1.default.create(props);
    }
    catch (error) {
        console.error(error);
    }
});
const broadcastNotification = (props) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield notification_1.default.create(props);
    }
    catch (error) {
        console.error(error);
    }
});
const createThread = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const role = req.body.role;
    const payload = {
        poster: req.body.id,
        title: req.body.title,
        content: req.body.content,
        type: req.body.type,
        parents: [],
    };
    try {
        const thread = yield thread_1.default.create(payload);
        if (role === enum_1.Role.ADMIN) {
            broadcastNotification({
                sender: req.body.id,
                threadId: String(thread._id),
                type: "broadcast",
            });
        }
        return res.status(201).json({ success: true, data: thread });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
});
exports.createThread = createThread;
const createReply = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const thread = yield thread_1.default.findById(id);
        const payload = {
            content: req.body.content,
            poster: req.body.id,
            parents: thread === null || thread === void 0 ? void 0 : thread.parents.concat(thread._id),
        };
        if (thread) {
            const newComment = yield thread_1.default.create(payload);
            yield newComment.save();
            thread.replies.push(newComment._id);
            yield thread.save();
            return res.status(201).json({ success: true, data: newComment });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
});
exports.createReply = createReply;
const deleteThread = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const thread = yield thread_1.default.findById(id);
        if (String(thread === null || thread === void 0 ? void 0 : thread.poster) === req.body.id || req.body.role === enum_1.Role.SUPER_ADMIN) {
            yield (thread === null || thread === void 0 ? void 0 : thread.deleteOne());
            return res.status(200).json({ success: true, data: thread });
        }
        return res
            .status(403)
            .json({ success: false, error: "You are not allowed to delete this thread" });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
});
exports.deleteThread = deleteThread;
const getSingleThread = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const thread = yield thread_1.default.findById(id).populate("poster", "username").exec();
        if (thread) {
            return res.status(200).json({ success: true, data: thread });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
});
exports.getSingleThread = getSingleThread;
const getAllThreads = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const search = req.query.search;
    try {
        const threads = yield thread_1.default.find(search ? { title: { $regex: search, $options: "i" } } : {})
            .populate({
            path: "poster",
            select: "username",
        })
            .exec();
        return res.status(200).json({ success: true, data: threads });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
});
exports.getAllThreads = getAllThreads;
const getReplyData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const thread = yield thread_1.default.findById(id);
        if (thread) {
            const replies = yield thread_1.default.find({ _id: { $in: thread.replies } })
                .populate("poster", "username")
                .exec();
            return res.status(200).json({ success: true, data: replies });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
});
exports.getReplyData = getReplyData;
const upvoteDownvoteThread = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const upvote = req.body.upvote;
        const userId = req.body.id;
        const thread = yield thread_1.default.findById(id);
        if (thread) {
            if (upvote) {
                if (thread.upvotes.includes(userId)) {
                    thread.upvotes = thread.upvotes.filter((id) => String(id) !== userId);
                }
                else if (thread.downvotes.includes(userId)) {
                    thread.downvotes = thread.downvotes.filter((id) => String(id) !== userId);
                    thread.upvotes.push(userId);
                    upvoteDownvoteNotification({
                        sender: userId,
                        threadId: id,
                        type: "upvote",
                    });
                }
                else {
                    thread.upvotes.push(userId);
                    upvoteDownvoteNotification({
                        sender: userId,
                        threadId: id,
                        type: "upvote",
                    });
                }
                yield thread.save();
                return res.status(200).json({ success: true, data: thread });
            }
            if (thread.downvotes.includes(userId)) {
                thread.downvotes = thread.downvotes.filter((id) => String(id) !== userId);
            }
            else if (thread.upvotes.includes(userId)) {
                thread.upvotes = thread.upvotes.filter((id) => String(id) !== userId);
                thread.downvotes.push(userId);
                upvoteDownvoteNotification({
                    sender: userId,
                    threadId: id,
                    type: "downvote",
                });
            }
            else {
                thread.downvotes.push(userId);
                upvoteDownvoteNotification({
                    sender: userId,
                    threadId: id,
                    type: "downvote",
                });
            }
            yield thread.save();
            return res.status(200).json({ success: true, data: thread });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
});
exports.upvoteDownvoteThread = upvoteDownvoteThread;
const bookmarkThread = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const userId = req.body.id;
        const thread = yield thread_1.default.findById(id);
        if (thread) {
            if (thread.bookmarks.includes(userId)) {
                thread.bookmarks = thread.bookmarks.filter((id) => String(id) !== userId);
            }
            else {
                thread.bookmarks.push(userId);
            }
            yield thread.save();
            return res.status(200).json({ success: true, data: thread });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
});
exports.bookmarkThread = bookmarkThread;
const reportThread = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const thread = yield thread_1.default.findById(id);
        if (thread) {
            const report = yield report_1.default.create({
                threadId: id,
                type: req.body.type,
                sender: req.body.id,
            });
            return res.status(201).json({ success: true, data: report });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
});
exports.reportThread = reportThread;
// const getThreadReports = async (req: Request, res: Response) => {
//   try {
//     const id = req.params.id;
//     const thread = await Thread.findById(id);
//     if (thread) {
//       const reports = await Report.find({ threadId: id });
//       return res.status(200).json({ success: true, data: reports });
//     }
//     return res.status(404).json({ success: false, error: "Thread not found" });
//   } catch (error) {
//     if (error instanceof Error) {
//       return res.status(500).json({ success: false, error: error.message });
//     }
//   }
// };
const getReportSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const thread = yield thread_1.default.findById(id);
        if (thread) {
            const reports = yield report_1.default.find({});
            const reportSummary = {
                hate: reports.filter((report) => report.type === enum_1.ReportCategory.HATE).length,
                abuse_harrasment: reports.filter((report) => report.type === enum_1.ReportCategory.ABUSE_HARASSMENT).length,
                violent_speech: reports.filter((report) => report.type === enum_1.ReportCategory.VIOLENT_SPEECH)
                    .length,
                spam: reports.filter((report) => report.type === enum_1.ReportCategory.SPAM).length,
                privacy: reports.filter((report) => report.type === enum_1.ReportCategory.PRIVACY).length,
                others: reports.filter((report) => report.type === enum_1.ReportCategory.OTHERS).length,
                count: reports.length,
            };
            return res.status(200).json({ success: true, data: reportSummary });
        }
        return res.status(404).json({ success: false, error: "Thread not found" });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, error: error });
        }
    }
});
exports.getReportSummary = getReportSummary;
const bulkDeleteThread = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const ids = query.ids;
    const deletedIds = [];
    try {
        if (req.body.role !== enum_1.Role.SUPER_ADMIN) {
            return res.status(403).json({ success: false, error: "Unauthorized" });
        }
        ids.forEach((id) => __awaiter(void 0, void 0, void 0, function* () {
            const thread = yield thread_1.default.findById(id);
            if (thread) {
                yield thread.deleteOne();
                deletedIds.push(id);
            }
        }));
        return res.status(200).json({ success: true, message: `Threads deleted: ${deletedIds}` });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
});
exports.bulkDeleteThread = bulkDeleteThread;

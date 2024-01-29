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
exports.getUser = exports.getNotification = exports.getBookmark = exports.getAllUsers = exports.editUser = exports.deleteUser = void 0;
const thread_1 = __importDefault(require("../models/thread"));
const user_1 = __importDefault(require("../models/user"));
const notification_1 = __importDefault(require("../models/notification"));
const enum_1 = require("../enums/enum");
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.body.id;
        const user = yield user_1.default.findById(id);
        const response = {
            id: user === null || user === void 0 ? void 0 : user._id,
            fullname: user === null || user === void 0 ? void 0 : user.fullname,
            username: user === null || user === void 0 ? void 0 : user.username,
            email: user === null || user === void 0 ? void 0 : user.email,
            role: user === null || user === void 0 ? void 0 : user.role,
            nik: user === null || user === void 0 ? void 0 : user.nik,
        };
        if (user) {
            return res.status(200).json({ success: true, data: response });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
});
exports.getUser = getUser;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.default.find({});
        return res.status(200).json(users);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
    }
});
exports.getAllUsers = getAllUsers;
const editUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.body.id;
        const role = req.body.role;
        const party = req.body.party;
        const status = req.body.status;
        const nikCode = req.body.nikCode;
        const adminAction = status === enum_1.NIKVerificationStatus.VERIFIED || status === enum_1.NIKVerificationStatus.REJECTED;
        if (party && role !== enum_1.Role.ADMIN) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (adminAction && role !== enum_1.Role.ADMIN) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        let updateObject = req.body;
        if (nikCode) {
            updateObject = Object.assign(Object.assign({}, updateObject), { "nik.nikCode": nikCode });
        }
        if (status) {
            updateObject = Object.assign(Object.assign({}, updateObject), { "nik.status": status });
            if (status === enum_1.NIKVerificationStatus.REJECTED) {
                updateObject = Object.assign(Object.assign({}, updateObject), { "nik.is_verified": false });
            }
            else if (status === enum_1.NIKVerificationStatus.VERIFIED) {
                updateObject = Object.assign(Object.assign({}, updateObject), { "nik.is_verified": true });
            }
        }
        const user = yield user_1.default.findByIdAndUpdate(id, { $set: updateObject }, { new: true });
        if (user) {
            return res
                .status(200)
                .json({ success: true, message: `User with email: ${user.email} updated`, data: user });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
});
exports.editUser = editUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.body.id;
        const user = yield user_1.default.findById(id);
        if (String(user === null || user === void 0 ? void 0 : user._id) !== req.body.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (user) {
            yield (user === null || user === void 0 ? void 0 : user.deleteOne());
            return res
                .status(200)
                .json({ success: true, message: `User with email: ${user === null || user === void 0 ? void 0 : user.email} deleted` });
        }
        return res.status(404).json({ success: false, message: "User not found" });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
    }
});
exports.deleteUser = deleteUser;
const getBookmark = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const search = req.query.search;
        const threads = yield thread_1.default.find(search ? { title: { $regex: search, $options: "i" } } : {});
        const userBookmark = threads.filter((thread) => thread.bookmarks.includes(req.body.id));
        return res.status(200).json({ success: true, data: userBookmark });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
});
exports.getBookmark = getBookmark;
const getNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const limit = Number(query.limit);
    try {
        // find all threads that the poster is the user
        const threads = yield thread_1.default.find({ poster: req.body.id });
        if (threads) {
            // find all notifications that the postId is same as threads(array).id or notification type is broadcast
            const notifications = yield notification_1.default.find({
                $or: [{ threadId: { $in: threads } }, { type: "broadcast" }],
            })
                .sort({ createdAt: -1 })
                .populate("sender", "username")
                .exec();
            if (notifications.length > limit && limit !== 0) {
                return res.status(200).json({ success: true, data: notifications.slice(0, limit) });
            }
            return res.status(200).json({ success: true, data: notifications });
        }
        return res.status(200).json({ success: true, data: [] });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
});
exports.getNotification = getNotification;

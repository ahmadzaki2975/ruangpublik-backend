"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const enum_1 = require("../enums/enum");
const threadSchema = new mongoose_1.default.Schema({
    parents: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Thread",
        },
    ],
    poster: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: false,
        trim: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        enum: Object.values(enum_1.ThreadType),
    },
    replies: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Thread",
        },
    ],
    upvotes: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    bookmarks: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    downvotes: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});
exports.default = mongoose_1.default.model("Thread", threadSchema);

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const enum_1 = require("../enums/enum");
const notificationSchema = new mongoose_1.default.Schema({
    sender: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    threadId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    },
    type: {
        type: String,
        enum: Object.values(enum_1.NotificationType),
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});
exports.default = mongoose_1.default.model("Notification", notificationSchema);

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
exports.createBroadcastNotification = void 0;
const notification_1 = __importDefault(require("../models/notification"));
const createBroadcastNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = {
            sender: req.body.sender,
            threadId: req.body.threadId,
            type: req.body.type,
        };
        const notification = yield notification_1.default.create(payload);
        return res.status(201).json({ success: true, data: notification });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
});
exports.createBroadcastNotification = createBroadcastNotification;

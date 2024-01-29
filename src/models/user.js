"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const enum_1 = require("../enums/enum");
const userSchema = new mongoose_1.default.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    nik: {
        nikCode: {
            type: String,
            required: true,
        },
        is_verified: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: Object.values(enum_1.NIKVerificationStatus),
            default: enum_1.NIKVerificationStatus.DRAFT,
        },
    },
    role: {
        type: String,
        required: true,
        enum: Object.values(enum_1.Role),
        default: enum_1.Role.USER,
    },
    party: {
        type: String,
        enum: Object.values(enum_1.PoliticalParty),
        required: false,
    },
});
exports.default = mongoose_1.default.model("User", userSchema);

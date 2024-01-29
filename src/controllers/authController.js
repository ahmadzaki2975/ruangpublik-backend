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
exports.userSignupController = exports.userLogoutController = exports.userLoginController = exports.googleAuthController = exports.googleAuthCallback = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const googleapis_1 = require("googleapis");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = require("mongoose");
const user_1 = __importDefault(require("../models/user"));
dotenv_1.default.config();
const oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, "http://localhost:5000/auth/google/callback");
const scopes = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
];
const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: "online",
    scope: scopes,
    include_granted_scopes: true,
});
const googleAuthController = (req, res) => {
    res.redirect(authorizationUrl);
};
exports.googleAuthController = googleAuthController;
const googleAuthCallback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.query;
    const { tokens } = yield oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    const oauth2 = googleapis_1.google.oauth2({
        auth: oauth2Client,
        version: "v2",
    });
    const { data } = yield oauth2.userinfo.get();
    if (!data) {
        return res.json({
            success: false,
            message: "Failed to retrieve user information from Google's OAuth2",
        });
    }
    const user = yield user_1.default.findOne({ email: data.email });
    if (!user) {
        try {
            // NOTE: Initiate user data with "-" since it is required
            const newUser = yield user_1.default.create({
                fullname: "-",
                username: data.name,
                email: data.email,
                password: "-",
                nik: {
                    nikCode: "-",
                },
            });
            newUser.save();
            return res.redirect("http://localhost:3000/signup?success=true");
        }
        catch (error) {
            return res.status(500).json({ success: false, error: "An unknown error occured" });
        }
    }
    const payload = { id: user === null || user === void 0 ? void 0 : user._id, email: user === null || user === void 0 ? void 0 : user.email, role: user === null || user === void 0 ? void 0 : user.role };
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const expiresIn = 60 * 60 * 24;
    const accessToken = jsonwebtoken_1.default.sign(payload, secret, { expiresIn });
    res.cookie("accessToken", accessToken, {
        httpOnly: false,
        sameSite: "none",
        secure: true,
        maxAge: 24 * 3600 * 1000,
    });
    return res.redirect("http://localhost:3000/");
});
exports.googleAuthCallback = googleAuthCallback;
const userSignupController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullname, username, email, password, nikCode, role } = req.body;
        const emailExist = yield user_1.default.findOne({ email });
        const usernameExist = yield user_1.default.findOne({ username });
        if (emailExist) {
            return res.status(400).json({ success: false, error: "Email already exist" });
        }
        if (usernameExist) {
            return res.status(400).json({ success: false, error: "Username already exist" });
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const user = {
            fullname,
            username,
            email,
            nik: { nikCode },
            password: hashedPassword,
            role: role !== null && role !== void 0 ? role : "user",
        };
        const newUser = yield user_1.default.create(user);
        yield newUser.save();
        return res.status(201).json({ success: true, message: `User with email: ${email} created!` });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ success: false, error: error.message });
        }
        if (error instanceof mongoose_1.MongooseError) {
            return res.status(400).json({ success: false, error: error.message });
        }
        else {
            return res.status(500).json({ success: false, error: "An unknown error occured" });
        }
    }
});
exports.userSignupController = userSignupController;
const userLoginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, error: "User is not registered" });
        }
        const matchPassword = yield bcrypt_1.default.compare(password, user.password);
        if (!matchPassword) {
            return res.status(401).json({ success: false, error: "Email or password are incorrect" });
        }
        const payload = { email: user.email, id: user._id, role: user.role };
        const secret = process.env.ACCESS_TOKEN_SECRET;
        const expiresIn = 60 * 60 * 24;
        const accessToken = jsonwebtoken_1.default.sign(payload, secret, { expiresIn });
        console.log("Access token: ", accessToken);
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge: 24 * 3600 * 1000,
        });
        console.log("User logged in");
        console.log("User data: ", user);
        return res.status(200).json({
            success: true,
            // message: `User with email: ${email} logged in`,
            message: accessToken,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ success: false, error: error.message });
        }
        if (error instanceof mongoose_1.MongooseError) {
            return res.status(400).json({ success: false, error: error.message });
        }
        else {
            return res.status(500).json({ success: false, error: "An unknown error occured" });
        }
    }
});
exports.userLoginController = userLoginController;
const userLogoutController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.cookie("accessToken", "", {
        maxAge: 0,
    });
    res.sendStatus(200);
});
exports.userLogoutController = userLogoutController;

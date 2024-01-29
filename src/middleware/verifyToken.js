"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith("Bearer ")))
        return res.sendStatus(401);
    const token = authHeader.split(" ")[1];
    jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        const decodedToken = decoded;
        if (err)
            return res.sendStatus(403);
        req.body.email = decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.email;
        req.body.id = decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id;
        req.body.role = decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.role;
        next();
    });
};
exports.verifyToken = verifyToken;

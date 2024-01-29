"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const morgan_1 = __importDefault(require("morgan"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const threadRoutes_1 = __importDefault(require("./routes/threadRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// ? Routes
app.get("/", (req, res) => {
    res.send(`
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * {
      padding: 0;
      margin: 0;
      box-sizing: border-box;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
  </style>
  <main style="min-height: 100vh; display: flex; gap: 10px; flex-direction: column; justify-content: center; align-items: center">
    <h1>Backend Ruang Publik</h1>
    <h2 style="font-weight: 600;">Version 0.0.1</h2>
    <p>&copy; Parasigma | 2024</p>
  </main>
  `);
});
// * Auth Routes
app.use("/auth", authRoutes_1.default);
// * User Routes
app.use("/users", userRoutes_1.default);
// * Thread Routes
app.use("/threads", threadRoutes_1.default);
// ? No Route Handler
app.use((req, res) => {
    res.status(404).send("No Route Found");
});
try {
    // connect to mongodb
    if (!process.env.MONGO_URI) {
        throw new Error("Connection String not found");
    }
    mongoose_1.default
        .connect(process.env.MONGO_URI)
        .then(() => console.log("Connected to Database"))
        .catch((err) => {
        console.error(err);
        throw new Error("Failed to connect to database");
    });
    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
    });
}
catch (err) {
    if (err instanceof Error) {
        console.error(err.message);
    }
    else {
        console.error("An unknown error occured");
    }
}

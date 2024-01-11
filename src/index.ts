import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose";
import userRouter from "./routes/userRoutes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

app.use(morgan("dev"));
app.use(express.json());

// ? Routes
app.get("/", (req: Request, res: Response) => {
  res.send(
    `
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
  `
  );
});
// * User Routes
app.use("/users", userRouter);

// ? No Route Handler
app.use((req, res) => {
  res.status(404).send("No Route Found");
});

try {
  // connect to mongodb
  if (!process.env.MONGO_URI) {
    throw new Error("Connection String not found");
  }
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to Database"))
    .catch((err) => {
      console.error(err);
      throw new Error("Failed to connect to database");
    });

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
} catch (err: unknown) {
  if (err instanceof Error) {
    console.error(err.message);
  } else {
    console.error("An unknown error occured");
  }
}
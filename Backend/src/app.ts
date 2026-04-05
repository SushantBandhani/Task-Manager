import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.routes.ts";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./utils/globalErrorHandler.ts";
import tasksRouter from "./routes/tasks.routes.ts";

const app = express();
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/tasks", tasksRouter);

app.use(globalErrorHandler);

export default app;

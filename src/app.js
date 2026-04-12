import { Router } from "express";
import mySqlApiRoute from "./routes/index.js";
import { successResponse } from "./shared/index.js";

const appRouter = Router();

// Basic route to verify that the server is running
appRouter.get("/", (req, res) => {
  res.json({ message: "Hello from server" });
});

// Health check endpoint to monitor the status of the application
appRouter.get("/health", (req, res) => {
  successResponse(
    req,
    res,
    { version: "1.0.0", uptime: process.uptime(), timestamp: new Date() },
    200,
  );
});

// Mounting the MySQL API routes under the /api/v1/employees path
appRouter.use("/api/v1/employees", mySqlApiRoute);

export default appRouter;

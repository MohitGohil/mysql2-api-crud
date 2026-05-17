import { config as dotEnvConfig } from "dotenv";
import express from "express";
import { createServer } from "http";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { connectMySQL } from "./config/index.js";
import { logger, NotFoundError, globalErrorHandler } from "./shared/index.js";
import appRouter from "./app.js";

const app = express();
const server = createServer(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotEnvConfig();
const PORT = process.env.PORT || "8000";

// Connect to MySQL database
connectMySQL();

// Use Helmet to set security-related HTTP headers
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// logger middleware
app.use(morgan("dev"));

// Handle app routes
app.use("/", appRouter);

// Handle 404 for undefined routes
appRouter.use(/(.*)/, (req, res, next) => {
  next(new NotFoundError("The requested resource was not found"));
});

// Global error handling middleware
app.use(globalErrorHandler);

server.listen(PORT, () => {
  logger.info(`Listening on port ${PORT}`);
});

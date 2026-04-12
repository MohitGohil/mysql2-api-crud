import pino from "pino";
import os from "node:os";

const env = process.env.NODE_ENV;
const isProd = process.env.NODE_ENV === "production";
const logDirPath = "../../../data/logs";

// Configure multiple transport targets for different log levels and formats
// Level hierarchy: fatal > error > warn > info > debug > trace
const transportTargets = [
  {
    target: "pino-pretty",
    level: isProd ? "info" : "debug",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname,env,service",
      messageKey: "message",
      destination: 1, // STDOUT
    },
  },
  {
    target: "pino/file",
    level: "info",
    options: {
      destination: `${logDirPath}/combined.log`,
      mkdir: true,
    },
  },
  {
    target: "pino/file",
    level: "error",
    options: {
      destination: `${logDirPath}/error.log`,
      mkdir: true,
    },
  },
];

const transport = pino.transport({ targets: transportTargets });

export const logger = pino(
  {
    level: isProd ? "info" : "debug",
    messageKey: "message",
    timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
    base: {
      service: "nodejs-api",
      env: env,
      host: os.hostname(),
      pid: process.pid,
    },
    redact: {
      paths: ["email", "*.email", "*.password", "*.apiKey"],
      censor: "[REDACTED]",
    },
  },
  transport,
);

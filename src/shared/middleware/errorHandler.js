import { AppError, errorResponse, logger } from "../index.js";

const isDev = process.env.NODE_ENV !== "production";

// Convert JS error names (e.g., CastError → cast_error)
const normalizeErrorType = (name = "internal_error") =>
  String(name)
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .toLowerCase();

// Centralized global error boundary
export const globalErrorHandler = (err, req, res, next) => {
  let statusCode;
  let message;
  let errorType;
  let errorCode;

  // ---------- Application Errors (our custom classes) ----------
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorType = err.type;
    errorCode = err.code;
  } else {
    // ---------- Framework / Library Error Mapping ----------
    statusCode = err?.statusCode || 500;
    message = err?.message || "Internal Server Error";
    errorType = normalizeErrorType(err?.name);
    errorCode = err?.code || "INTERNAL_SERVER_ERROR";

    if (err?.name === "ValidationError" || err?.isJoi) {
      statusCode = 400;
      errorType = "validation_error";
      errorCode = "VALIDATION_ERROR";
    } else if (err?.name === "CastError") {
      statusCode = 400;
      message = `Invalid value for ${err.path || "ID"}`;
      errorType = "cast_error";
      errorCode = "INVALID_ID";
    } else if (err?.name === "JsonWebTokenError") {
      statusCode = 401;
      message = "Invalid token. Please log in again.";
      errorType = "authentication_error";
      errorCode = "INVALID_TOKEN";
    } else if (err?.name === "TokenExpiredError") {
      statusCode = 401;
      message = "Token expired. Please log in again.";
      errorType = "authentication_error";
      errorCode = "TOKEN_EXPIRED";
    } else if (err?.code === 11000) {
      statusCode = 400;
      message = `${Object.keys(err.keyValue || {}).join(", ")} field must be unique`;
      errorType = "duplicate_error";
      errorCode = "DUPLICATE_FIELD";
    }

    // ---------- Node / System Error Mapping ----------
    else if (err?.code === "ECONNRESET") {
      statusCode = 500;
      errorType = "network_error";
      errorCode = "CONNECTION_RESET";
    } else if (err?.code === "ETIMEDOUT") {
      statusCode = 500;
      errorType = "network_timeout";
      errorCode = "REQUEST_TIMEOUT";
    }

    // ---------- Fallback Safety ----------
    if (!errorType || errorType === "error") {
      errorType = statusCode >= 500 ? "server_error" : "application_error";
    }
  }

  // Strip query params to avoid logging sensitive data
  const safeRoute = (req.originalUrl || req.url || "").split("?")[0];

  // High-resolution response time calculation
  let responseTimeMs = 0;
  if (req._startAt) {
    const diff = process.hrtime(req._startAt);
    responseTimeMs = Math.round((diff[0] * 1e9 + diff[1]) / 1e6);
  } else if (req._startTime) {
    responseTimeMs = Date.now() - (req._startTime instanceof Date ? req._startTime.getTime() : req._startTime);
  }

  const errorLog = {
    type: statusCode >= 500 ? "error" : "warning",
    requestId: req.id,
    method: req.method,
    route: safeRoute,
    statusCode,
    errorType,
    errorCode,
    stack: err.stack,
    responseTimeMs,
  };

  statusCode >= 500 ? logger.error(errorLog, message) : logger.warn(errorLog, message);

  // Hide internal error details in production for 5xx
  const safeMessage = statusCode >= 500 && !isDev ? "Internal Server Error" : message;

  return errorResponse(
    res,
    {
      type: errorType,
      code: errorCode,
      message: safeMessage,
    },
    statusCode,
  );
};

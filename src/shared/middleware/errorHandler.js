import { AppError, errorResponse, logger } from "../index.js";

export const globalErrorHandler = (err, req, res, next) => {
  let statusCode;
  let message;
  let errorType;
  let errorCode;

  // --------- Custom Application Error Handling ----------
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorType = err.type;
    errorCode = err.code;
  } else {
    // ---------- Framework / Library Error Mapping ----------
    statusCode = err?.statusCode || 500;
    message = err?.message || "Internal Server Error";
    errorType = "internal_error";
    errorCode = "INTERNAL_ERROR";
  }

  logger.error(
    {
      errMessage: err.message,
      errStack: err.stack,
      errorType,
      errorCode,
    },
    "Global error handler caught an error",
  );

  return errorResponse(req, res, message, statusCode);
};

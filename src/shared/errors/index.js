export class AppError extends Error {
  constructor(message, statusCode, type, code) {
    super(message);
    this.statusCode = statusCode;
    this.type = type;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/** 400 — Bad Request */
export class BadRequestError extends AppError {
  constructor(message = "Bad request") {
    super(message, 400, "bad_request", "BAD_REQUEST");
  }
}

/** 403 — Forbidden */
export class ForbiddenError extends AppError {
  constructor(message = "Forbidden access") {
    super(message, 403, "forbidden", "FORBIDDEN");
  }
}

/** 404 — Not Found */
export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404, "not_found", "NOT_FOUND");
  }
}

/** 500 — Internal Server Error */
export class InternalError extends AppError {
  constructor(message = "Internal server error") {
    super(message, 500, "internal_error", "INTERNAL_ERROR");
  }
}

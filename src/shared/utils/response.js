export const successResponse = (req, res, payload = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data: payload,
  });
};

export const errorResponse = (req, res, message, statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    error: message,
  });
};

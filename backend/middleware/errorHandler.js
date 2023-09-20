const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  // Pass error to next middleware
  next(error);
};

const errorHandler = (err, req, res, next) => {
  // If status code is 200, set status to 500
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  if (err.name === "CastError" && err.kind === "ObjectId") {
    message = "Invalid ID";
    statusCode = 404;
  }
  // Set status to statusCode
  res.status(statusCode);

  // Return error message
  res.json({
    message,
    // If in development mode, return stack trace
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export { notFound, errorHandler };

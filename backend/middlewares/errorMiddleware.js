/* eslint-disable no-use-before-define */
const ApiError = require("../utils/apiError");


const nodeEnv=process.env.NODE_ENV||'development'

const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (nodeEnv === "development") {
    sendErrForDev(err, res);
  } else {
    if (err.name === "JsonWebTokenError") err = handleJwtInvalidToken();
    sendErrForProd(err, res);
  }
};

const sendErrForDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    erorr: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrForProd = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

const handleJwtInvalidToken = () =>
  new ApiError("Invalid token ,please login", 401);

module.exports = errorMiddleware;
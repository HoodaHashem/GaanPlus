import 'dotenv/config';
import logger from './logger.js';

const globalErrors = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  logger.error({
    message: err.message,
    status: err.status,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
  });
  
  if (process.env.APP_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
    });
  } else {
    res.status(err.statusCode).json({
      status: err.status,
      message: "Something went wrong",
    });
  }
};

export default globalErrors;

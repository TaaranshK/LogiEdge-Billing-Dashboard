const errorHandler = (err, req, res, next) => {
  console.error('❌ Error caught by global handler:');
  console.error(`   Message : ${err.message}`);
  console.error(`   Route   : ${req.method} ${req.originalUrl}`);
  const statusCode = err.statusCode || 500;
 const message = statusCode === 500
    ? 'Something went wrong on our end. Please try again.'
    : err.message;
     res.status(statusCode).json({
    success : false,
    message : message
  });
};

module.exports = errorHandler;
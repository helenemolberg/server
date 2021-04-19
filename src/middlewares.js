const notFound = (req, res, next) =>{
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

// Must have 4 params in middleware 
// eslint-diable-next-line no-unused-vars 
const errorHandler = (error, req, res, next) =>{
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: error.message,
        // Don't want to show the stack when deployed 
        stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack,
    });
};

module.exports = {
    notFound,
    errorHandler,
};
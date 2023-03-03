const AppError = require('../utils/appError');

/**
 * It sends the error to the client in a JSON format.
 * @param err - The error object
 * @param req - The request object
 * @param res - The response object
 */
const sendErrorDev = (err, req, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });

    console.log(err);
};
/**
 * If the error is operational, send the error message to the client. If the error is not operational,
 * log the error and send a generic error message to the client
 * @param err - the error object
 * @param req - The request object
 * @param res - The response object.
 * @returns the response.
 */
const sendErrorProduction = (err, req, res) => {
    // Operational
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
        // Programming error
    } else {
        // 1 log error
        console.error('Error', err);

        // 2 send generic response
        res.status(500).json({
            status: 'error',
            error: 'Something went very wrong',
        });
    }
};

/**
 * If the error is a JsonWebTokenError, then return a new AppError with a message of 'Token invalida.
 * Inicie sesion de nuevo.' and a status of 401.
 * @param err - The error object that was thrown by the JWT library.
 */
const handleJWTError = (err) =>
    new AppError('Token invalida. Inicie sesion de nuevo.', 401);

/**
 * If the error is a JWT error, then return a new AppError with a message of 'Tu sesion ha expirado.
 * Inicia sesion de nuevo.' and a status code of 401.
 * @param err - The error object that was thrown.
 */
const handleJWTExpiredError = (err) =>
    new AppError('Tu sesion ha expirado. Inicia sesion de nuevo.', 401);

/**
 * It takes an error object, and returns a new AppError object with a message that is a concatenation
 * of a string and the second word of the error message.
 * @param err - The error object that was thrown by the database.
 */
const handleBadField = (err) =>
    new AppError(
        `Parametro de busqueda invalido ${err.sqlMessage.split(' ')[2]}.`,
        404
    );

/**
 * catch all errors and send a personalized reponse depending on the error name
 * @param {Obj} error - The error caught by the middleware.
 * @param {Obj} req - The req object.
 * @param {Obj} res - The res object.
 * @param {function} next - The next function.
 */
module.exports = (err, req, res, next) => {
    res.locals.error = err;
    err.status = err.status || 'error';
    err.statusCode = err.statusCode || 500;

    if (process.env.NODE_ENV === 'development') {
        return sendErrorDev(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        // con esto identificaremos los errores de validación
        let error = Object.create(err);
        if (err.name === 'JsonWebTokenError') error = handleJWTError(err);
        if (err.name === 'TokenExpiredError')
            error = handleJWTExpiredError(err);
        if (err.code === 'ER_BAD_FIELD_ERROR') error = handleBadField(err);
        return sendErrorProduction(error, req, res);
    }
    next(err);
};

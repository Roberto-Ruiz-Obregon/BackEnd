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

        // Verifies if it is an image file
        if(err.message.toString() == 'Input buffer contains unsupported image format'){
            res.status(400).json({
                status: 'error',
                error: 'El archivo no es una imagen. Intenta de nuevo.',
            });
        }

        // Verifies if the file is an image larger than 10MB
        if(err.message.toString() == 'request entity too large'){
            res.status(400).json({
                status: 'error',
                error: 'El archivo pesa más de 10 MB. Intenta de nuevo.',
            });
        }

        // 2 send generic response
        res.status(500).json({
            status: 'error',
            error: 'Lo sentimos, algo salió muy mal. Intenta más tarde.',
        });
    }
};

/**
 * If the error is a JsonWebTokenError, then return a new AppError with a message of 'Token invalida.
 * Inicie sesion de nuevo.' and a status of 401.
 * @param err - The error object that was thrown by the JWT library.
 */
const handleJWTError = (err) =>
    new AppError('Token inválida. Inicie sesión de nuevo.', 401);

/**
 * If the error is a JWT error, then return a new AppError with a message of 'Tu sesion ha expirado.
 * Inicia sesion de nuevo.' and a status code of 401.
 * @param err - The error object that was thrown.
 */
const handleJWTExpiredError = (err) =>
    new AppError('Tu sesión ha expirado. Inicia sesión de nuevo.', 401);

/**
 * It takes an error object, and returns a new AppError object with a message that is a concatenation
 * of a string and the second word of the error message.
 * @param err - The error object that was thrown by the database.
 */
const handleBadField = (err) =>
    new AppError(
        `Parámetro de búsqueda inválido ${err.sqlMessage.split(' ')[2]}.`,
        404
    );

/**
 * If the error is a CastError, then return a new AppError with the message "Invalido ${err.path}:
 * ${err.value}" and a status code of 400.
 * @param err - The error object that was thrown by Mongoose.
 * @returns A new instance of AppError with the message and status code.
 */
const handleCastErrorDB = (err) => {
    const message = `Inválido ${err.path}: ${err.value}`;
    // 400 stands for bad request
    return new AppError(message, 400);
};

/**
 * It takes an error object and returns a new error object with a custom message
 * @param err - The error object that was thrown by Mongoose.
 * @returns The value of the duplicate field.
 */
const handleDuplicateFieldsDB = (err) => {
    // To remove it we use a regular expression.
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/); // nos matchea todos
    const message = `Valor duplicado: ${value[0]}. Por favor use otro valor.`;
    return new AppError(message, 400);
};

/**
 * It takes an error object as an argument, and returns a new AppError object with a message and a
 * status code.
 * @param err - The error object that was thrown
 * @returns A new AppError object with the message and status code.
 */
const handleValidationErrorDB = (err) => {
    // Mongoose gives us an array of errors to go through
    const errors = Object.values(err.errors).map((err) => err.message);
    const message = `Datos inválidos: ${errors.join('. ')}`;
    return new AppError(message, 400);
};

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
        console.log('Error Name:', err.name);
        console.log('Error code:', err.code);
        return sendErrorDev(err, req, res);
    } else if (
        process.env.NODE_ENV === 'production' ||
        process.env.NODE_ENV === 'test'
    ) {
        // con esto identificaremos los errores de validación
        let error = Object.create(err);
        if (err.name === 'CastError') error = handleCastErrorDB(err);
        if (err.code === 11000) error = handleDuplicateFieldsDB(err);
        if (err.name === 'ValidationError')
            error = handleValidationErrorDB(err);
        if (err.name === 'JsonWebTokenError') error = handleJWTError(err);
        if (err.name === 'TokenExpiredError')
            error = handleJWTExpiredError(err);
        if (err.code === 'ER_BAD_FIELD_ERROR') error = handleBadField(err);
        return sendErrorProduction(error, req, res);
    }
    next(err);
};

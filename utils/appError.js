/** Class representing operational app error */
class AppError extends Error {
    /**
     * Create an operational AppError.
     * @param {string} message - The error message.
     * @param {number} statusCode - The y value.
     */
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;

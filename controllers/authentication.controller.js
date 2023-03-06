const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('./../models/userModel');

const catchAsync = require('./../utils/catchAsync');
// const Email = require('./../utils/email');
const AppError = require('./../utils/appError');

/**
 * This function takes an id as an argument and returns a signed JWT token with the id as the payload
 * and the JWT_SECRET and JWT_EXPIRES_IN as the secret and expiration time respectively.
 * @param id - the user id
 * @returns The signToken function is returning a JWT token.
 */
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

/**
 * It creates a JWT token, sets the cookie options, sets the cookie, and sends the response.
 * @param user - the user object that we just created or updated
 * @param statusCode - The HTTP status code to send back to the client.
 * @param req - The request object
 * @param res - the response object
 */
const createSendToken = (user, statusCode, req, res) => {
    const token = signToken(user._id);

    // WEB ONLY - FOR ADMINISTRATORs LOGIN
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 1000
        ),
        httpOnly: true,
        secure: req.secure || req.headders('x-forwarded-proto') === 'https',
    };

    res.cookie('jwt', token, cookieOptions);

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user,
        },
    });
};

/* The above code is checking if the user is logged in. If the user is logged in, the user is allowed
to access the protected route. If the user is not logged in, the user is not allowed to access the
protected route. */
exports.protect = catchAsync(async (req, res, next) => {
    // 1) Getting the token and check if its there
    // We will be receiving the token in a header in the request.
    let token;
    if (
        // It is an standard that the authorizarrion header includes the word Bearer
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];

        // WEB ONLY
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        return next(
            new AppError(
                'No haz iniciado sesion, por favor inicia sesion antes de ingresar.',
                401
            ) //401 means not authorized
        );
    }
    // 2) Verification: Validate the token to view if the signature is valid
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // decoded will be the payload of the JWT

    // 3) Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
        return next(new AppError('El usuario ya no existe.', 401));
    }

    // 4) Check if user changed passwords after the token was issued
    if (user.changedPasswordAfter(decoded.iat)) {
        // iat - issued at
        return next(
            new AppError(
                'User recently changed password! Please login again',
                401
            )
        );
    }
    // 5) Next is called and the req accesses the protected route
    req.user = user;
    next();
});

const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/users.model');
const Admin = require('./../models/admins.model');
const Inscription = require('./../models/inscriptions.model');

const catchAsync = require('./../utils/catchAsync');
const Email = require('./../utils/email');
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
        secure: req.secure,
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

/**
 * The above code is checking if the user is logged in. If the user is logged in, the user is allowed
 * to access the protected route. If the user is not logged in, the user is not allowed to access the
 * protected route.
 */
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
    console.log(token);
    if (!token) {
        return next(
            new AppError(
                'No has iniciado sesión, por favor inicia sesión antes de ingresar.',
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

/* Creating a new user. */
exports.signUpUser = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        age: req.body.age,
        gender: req.body.gender,
        job: req.body.job,
        educationLevel: req.body.educationLevel,
        postalCode: req.body.postalCode,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });

    try {
        await new Email(newUser, process.env.LANDING_URL).sendWelcome();
    } catch (error) {
        return next(
            new AppError(
                'Hemos tenido problemas enviando un correo de bienvenida.',
                500
            )
        );
    }

    return createSendToken(newUser, 201, req, res);
});

/* Creating a new admin. */
exports.signUpAdmin = catchAsync(async (req, res, next) => {
    const newUser = await Admin.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });

    try {
        await new Email(newUser, process.env.LANDING_URL).sendWelcome();
    } catch (error) {
        return next(
            new AppError(
                'Hemos tenido problemas enviando un correo de bienvenida.',
                500
            )
        );
    }

    // After signup a verified admin must approve the new admin
    res.status(200).json({
        status: 'success',
        message:
            'Te has registrado con éxito, espera a que un administrador verifique tu perfil.',
    });
});

/**
 * Checking if the user is logged in. If the user is logged in, the user is allowed
 * to access the protected route. If the user is not logged in, the user is not allowed to access the
 * protected route.
 */
exports.loginUser = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        // After calling next we want the function to end and send an error.
        return next(
            new AppError(
                'Por favor ingrese un email y contraseña válidos.',
                400
            )
        );
    }

    // 2 Check is user exists.
    const user = await User.findOne({ email }).select('+password'); // adding a + to the field set as selected false means we will retrieve it

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Email o contraseña incorrectos.', 401));
    }

    // 3 Send JWT to user.
    createSendToken(user, 201, req, res);
});

/**
 * Checking if the admin is logged in. If the user is logged in, the user is allowed
 * to access the protected route. If the user is not logged in, the user is not allowed to access the
 * protected route.
 */
exports.loginAdmin = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        // After calling next we want the function to end and send an error.
        return next(
            new AppError(
                'Por favor ingrese un email y contraseña válidos.',
                400
            )
        );
    }

    // 2 Check is user exists and has been verified.
    const user = await Admin.findOne({ email }).select(
        '+password +hasVerification'
    ); // adding a + to the field set as selected false means we will retrieve it

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Email o contraseña incorrectos.', 401));
    }

    if (!user.hasVerification) {
        return next(
            new AppError(
                'No haz sido verificado, espera a que un administrador verifique tu perfil.',
                401
            )
        );
    }
    // 3 Send JWT to user.
    createSendToken(user, 201, req, res);
});

/* Setting the cookie to loggedout and then sending a response. */
exports.logout = (req, res, next) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
    });
    res.status(200).json({ status: 'success' });
};

/**
 * The above code is checking if the user is logged in. If the user is logged in, the user is allowed
 * to access the protected route. If the user is not logged in, the user is not allowed to access the
 * protected route.
 */
exports.protect = catchAsync(async (req, res, next) => {
    // 1) Getting the token and check if its there
    let token;
    if (
        // es un estandard que el token vaya con este header y con el Bearer antes
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    // console.log('Token used: ', token);

    if (!token) {
        return next(
            new AppError(
                'No has iniciado sesión, por favor inicia sesión para obtener acceso.',
                401
            )
        );
    }
    // 2) Verification: Validate the token to view if the signature is valid
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // decoded will be the JWT payload

    // 3) Check if user or admin exists
    const user = await User.findById(decoded.id);
    const admin = await Admin.findById(decoded.id);
    if (!user && !admin) {
        return next(
            new AppError(
                'El usuario con el que intentas ingresar ya no existe.',
                401
            )
        );
    }

    // 4) Check if user changed passwords after the token was issued
    // PARA ESTE CREAREMOS UN nuevo metodo de INSTANCIA
    if (
        (user && user.changedPasswordAfter(decoded.iat)) ||
        (admin && admin.changedPasswordAfter(decoded.iat))
    ) {
        // iat - issued at
        return next(
            new AppError(
                'Has cambiado recientemente tu contraseña. Inicia sesión de nuevo.',
                401
            )
        );
    }

    // 5) Next is called and the req accesses the protected route
    if (user) {
        req.userType = 'User';
        req.user = user;
    } else if (admin) {
        req.userType = 'Admin';
        req.admin = admin;
    }
    next();
});

/* Setting the user id to the params id. */
exports.getMe = catchAsync(async (req, res, next) => {
    // Using this route before getOne lets us leverage the already created endpoint.
    let userActive = req.userType == 'User' ? req.user : req.admin;
    req.params.id = userActive._id;
    next();
});

/* Setting the user id to the params id. */
exports.getMyCourses = catchAsync(async (req, res, next) => {
    const userId = req.user._id;

    const results = await Inscription.aggregate([
        {
            $match: {
                user: userId,
            },
        },
        {
            $lookup: {
                from: 'courses',
                localField: 'course',
                foreignField: '_id',
                as: 'course',
            },
        },
        {
            $unwind: '$course',
        },
    ]);

    const courses = results.map((ins) => ins.course);

    // 3 respond with update
    res.status(200).json({
        status: 'success',
        results: courses.length,
        data: {
            documents: courses,
        },
    });
});

/* Updating the user or admin. */
exports.editMe = catchAsync(async (req, res, next) => {
    // 1 Check for password
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(
                'Para cambiar tu contraseña debes usar otra ruta. Usa esta función solo para cambiar tu perfil.',
                400
            )
        );
    }

    let userActive = req.userType == 'User' ? req.user : req.admin;
    let Model = req.userType == 'User' ? User : Admin;
    // 2 Update document
    const user = await Model.findByIdAndUpdate(userActive._id, req.body, {
        // queremos que regrese el viejo
        new: true,
        runValidators: true,
    });

    // 3 respond with update
    res.status(200).json({
        status: 'success',
        data: {
            user,
        },
    });
});

/* Deletes the user by its id*/
exports.deleteMe = catchAsync(async (req, res, next) => {
    let userActive = req.userType == 'User' ? req.user : req.admin;
    let Model = req.userType == 'User' ? User : Admin;

    if (req.userType != 'User') {
        return next(
            new AppError('Esta función es sólo para borrar usuarios.', 400)
        );
    }

    // 2 Update document
    const user = await Model.findByIdAndDelete(userActive._id);

    // 3 respond with update
    res.status(200).json({
        status: 'success',
        data: {
            user,
        },
    });
});

/* Restricting the user to a certain role. */
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.userType)) {
            next(
                new AppError(
                    'No cuentas con los permisos para realizar esta acción.',
                    403
                )
            );
        }
        next();
    };
};

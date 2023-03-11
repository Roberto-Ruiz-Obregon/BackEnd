const User = require('./../models/users.model');
const Admin = require('./../models/admins.model');
const crypto = require('crypto');

const catchAsync = require('./../utils/catchAsync');
const Email = require('./../utils/email');
const AppError = require('./../utils/appError');

/* The above code is sending an email to the user with a link to reset their password. */
exports.forgotPasswordAdmin = catchAsync(async (req, res, next) => {
    // 1 get user based on posted email
    const user = await Admin.findOne({ email: req.body.email });
    if (!user) {
        return next(
            new AppError('No existe un usuario con esa contraseña.', 404)
        );
    }
    // 2 generate random token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false }); // we save the new resetToken at user

    // 3 send it back as an email
    const resetURL = `${req.protocol}://${req.get(
        'host'
    )}/retrievePassword/${resetToken}`;

    // si falla queremos eliminar la token
    try {
        await new Email(user, resetURL).sendPasswordReset();
    } catch (err) {
        user.createPasswordResetToken = undefined;
        user.createPasswordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(
            new AppError(
                'Hubo un error enviando el correo de confirmacion. Intenta de nuevo',
                500
            )
        );
    }

    res.status(200).json({
        status: 'success',
        message: 'Correo para recuperar tu contraseña enviado.',
    });
});

/* This is the code that is executed when the user clicks on the link in the email. It is a GET request
to the server. The server then checks if the token is valid and if it is, it allows the user to
change their password. */
exports.resetPasswordAdmin = catchAsync(async (req, res, next) => {
    // 1 get user based on token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.id)
        .digest('hex');
    // get user based on reset token and expiration date
    const user = await Admin.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gte: Date.now() },
    });

    // 2 if token has not expired and there is user set new password
    if (!user)
        return next(new AppError('Token invalida o correo incorrecto', 400));
    // 3 update changedPasswordAt property for the user
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    // 4 log the user in and send jwt
    res.status(200).json({
        status: 'success',
        message:
            'Contraseña cambiada con exito. Quiza debas iniciar sesion de nuevo',
    });
});

/* The above code is sending an email to the user with a link to reset their password. */
exports.forgotPasswordUser = catchAsync(async (req, res, next) => {
    // 1 get user based on posted email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(
            new AppError('No existe un usuario con esa contraseña.', 404)
        );
    }
    // 2 generate random token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false }); // we save the new resetToken at user

    // 3 send it back as an email
    const resetURL = `${req.protocol}://${req.get(
        'host'
    )}/retrievePassword/${resetToken}`;

    // si falla queremos eliminar la token
    try {
        await new Email(user, resetURL).sendPasswordReset();
    } catch (err) {
        user.createPasswordResetToken = undefined;
        user.createPasswordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(
            new AppError(
                'Hubo un error enviando el correo de confirmacion. Intenta de nuevo',
                500
            )
        );
    }

    res.status(200).json({
        status: 'success',
        message: 'Correo para recuperar tu contraseña enviado.',
    });
});

/* This is the code that is executed when the user clicks on the link in the email. It is a GET request
to the server. The server then checks if the token is valid and if it is, it allows the user to
change their password. */
exports.resetPasswordUser = catchAsync(async (req, res, next) => {
    // 1 get user based on token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.id)
        .digest('hex');
    // get user based on reset token and expiration date
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gte: Date.now() },
    });

    // 2 if token has not expired and there is user set new password
    if (!user)
        return next(new AppError('Token invalida o correo incorrecto', 400));
    // 3 update changedPasswordAt property for the user
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    // 4 log the user in and send jwt
    res.status(200).json({
        status: 'success',
        message:
            'Contraseña cambiada con exito. Quiza debas iniciar sesion de nuevo',
    });
});

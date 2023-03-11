const User = require('./../models/users.model');
const Admin = require('./../models/admins.model');
const crypto = require('crypto');

const catchAsync = require('./../utils/catchAsync');
const Email = require('./../utils/email');
const AppError = require('./../utils/appError');

/**
 * It takes a user's email, creates a reset token, saves it to the user, and sends an email with a link
 * to reset the password.
 * @param Model - The model you want to use.
 * @param email - the email of the user who wants to reset their password
 * @returns Nothing.
 */
const forgotPassword = async (Model, email, req, userType) => {
    // 1 get user based on posted email
    const user = await Model.findOne({ email });
    if (!user) {
        throw new AppError('No existe un usuario con ese correo.', 404);
    }
    // 2 generate random token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false }); // we save the new resetToken at user

    // 3 send it back as an email
    const resetURL = `${req.protocol}://${req.get(
        'host'
    )}/retrievePassword/${userType}/${resetToken}`;

    // si falla queremos eliminar la token
    try {
        await new Email(user, resetURL).sendPasswordReset();
    } catch (err) {
        user.passwordResetExpires = undefined;
        user.passwordResetToken = undefined;
        await user.save({ validateBeforeSave: false });
        throw new AppError(
            'Hubo un error enviando el correo de confirmacion. Intenta de nuevo',
            500
        );
    }
};

/* The above code is sending an email to the user with a link to reset their password. */
exports.forgotPasswordAdmin = catchAsync(async (req, res, next) => {
    await forgotPassword(Admin, req.body.email, req, 'admin');

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
    await forgotPassword(User, req.body.email, req, 'user');

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

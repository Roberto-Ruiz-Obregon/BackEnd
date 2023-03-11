const User = require('./../models/users.model');
const Admin = require('./../models/admins.model');

const catchAsync = require('./../utils/catchAsync');
const Email = require('./../utils/email');
const AppError = require('./../utils/appError');

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

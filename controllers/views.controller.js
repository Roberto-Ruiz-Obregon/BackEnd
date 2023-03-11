const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
    res.status(200).render('overview', {
        title: 'Inicio',
    });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    // Send temlate with data
    res.status(200).render('passwordreset', {
        title: 'Inicio',
        resetToken: req.params.id,
        userType: req.params.user,
    });
});

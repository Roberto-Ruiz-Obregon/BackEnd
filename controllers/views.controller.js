const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
    // 3 render template
    res.status(200).render('overview', {
        title: 'Inicio',
    });
});

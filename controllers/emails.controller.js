const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/users.model');
const Email = require('../utils/email');

/* A function that is being exported. */
exports.sendToEveryone = catchAsync(async (req, res, next) => {
    const usersToAlert = await User.find({ emailAgreement: true });

    try {
        await Email.sendAnnouncementToEveryone(
            usersToAlert,
            '',
            req.body.imageUrl,
            req.body.message,
            req.body.subject
        );
    } catch (error) {
        console.log(error);
        return next(
            new AppError(
                'Hemos tenido problemas enviando los correos a todos los usuarios.',
                500
            )
        );
    }

    res.status(201).json({
        status: 'success',
    });
});

/* A function that is being exported. */
exports.sendByZone = catchAsync(async (req, res, next) => {
    const usersToAlert = await User.find({
        emailAgreement: true,
        postalCode: req.body.postalCode,
    });

    try {
        await Email.sendAnnouncementToEveryone(
            usersToAlert,
            '',
            req.body.imageUrl,
            req.body.message,
            req.body.subject
        );
    } catch (error) {
        console.log(error);
        return next(
            new AppError(
                'Hemos tenido problemas enviando los correos a todos los usuarios.',
                500
            )
        );
    }

    res.status(201).json({
        status: 'success',
    });
});

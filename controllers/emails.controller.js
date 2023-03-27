const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require(`../utils/apiFeatures`);
const factory = require('./handlerFactory.controller');
const User = require('../models/users.model');
const Email = require('../utils/email');
const { request } = require('express');
const { user } = require('firebase-functions/v1/auth');


exports.sendToEveryone = catchAsync(async (req, res, next) => {
    const usersToAlert = await User.find({ emailAgreement: true });
    console.log(req.body)
    try {
        await Email.sendAnnouncementToEveryone(usersToAlert,'', req.body.imageUrl, req.body.message, req.body.subject);
    } catch (error) {
        console.log(error)
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


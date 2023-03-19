const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require(`../utils/apiFeatures`);
const factory = require('./handlerFactory.controller');
const Course = require('../models/courses.model');
const User = require('../models/users.model');
const Email = require('../utils/email');

exports.getAllCourses = factory.getAll(Course);
exports.getCourse = factory.getOne(Course, ['topics']);
exports.updateCourse = factory.updateOne(Course);
exports.deleteCourse = factory.deleteOne(Course);

exports.createCourse = catchAsync(async (req, res, next) => {
    const document = await Course.create(req.body);

    const usersToAlert = await User.find({
        $or: [
            // Query and send mail to users in the area
            {
                postalCode: document.postalCode,
            },
            // Query and send email to users interested in topics
            { topics: { $in: document.topics } },
        ],
        emailAgreement: true,
    });

    await Email.sendMultipleNewCourseAlert(usersToAlert, document);

    res.status(201).json({
        status: 'success',
        data: {
            document,
        },
    });
});

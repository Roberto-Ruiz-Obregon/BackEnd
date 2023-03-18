const factory = require('./handlerFactory.controller');
const Inscription = require('../models/inscriptions.model');
const Course = require('../models/courses.model');
const catchAsync = require('../utils/catchAsync');
const Email = require('../utils/email');
const AppError = require('../utils/appError');

exports.getAllInscriptions = factory.getAll(Inscription);
exports.getInscription = factory.getOne(Inscription, ['user', 'course']);

// TODO: CREATE CUSTOM MIDDLEWARE TO TAKE INTO ACCOUNT BUSINESS RULES
// 1 reduce or add to capacity of course
exports.createInscription = factory.createOne(Inscription);
exports.deleteInscription = factory.deleteOne(Inscription);

exports.inscribeTo = catchAsync(async (req, res, next) => {
    const courseId = req.body.courseId;
    if (!courseId) {
        return next(
            new AppError(
                'Envia la clave del curso para poderte inscribir.',
                400
            )
        );
    }

    const course = await Course.findById(courseId);
    if (!course) {
        return next(
            new AppError('No se encontro ningun curso con esta clave.', 404)
        );
    }

    // Check if this user has inscribed to this course
    const inscription = await Inscription.find({
        course: courseId,
        user: req.user._id,
    });
    if (inscription) {
        return next(new AppError('Ya te haz inscrito a este curso.', 400));
    }

    // Update course capacity
    course.capacity = course.capacity - 1;
    await course.save();

    Inscription.create({
        course: courseId,
        user: req.user._id,
    });

    await new Email(
        req.user,
        process.env.LANDING_URL,
        course
    ).sendInscriptonAlert();

    res.status(200).json({
        status: 'success',
        data: { document: course },
    });
});

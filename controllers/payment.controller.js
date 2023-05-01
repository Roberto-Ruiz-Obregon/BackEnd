const factory = require('./handlerFactory.controller');
const Payment = require('../models/payments.model');
const Course = require('../models/courses.model');
const Inscription = require('../models/inscriptions.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');

exports.getAllPayments = factory.getAll(Payment, [
    { path: 'user', select: 'email name postalCode age educationLevel' },
    {
        path: 'course',
        select: 'courseName teachers modality description cost capacity startDate endDate bankAccount',
        populate: 'topics',
    },
]);
exports.getPayment = factory.getOne(Payment, ['user', 'course']);
exports.createPayment = factory.createOne(Payment);

/** BUSINESS RULES
 * When creating a payment it starts as pending and reduces course capacity by 1
 * If payment is rejected, course capacity is augmented by 1
 * When a payment is accepted a confirmation mail is sent and inscription is created
 * When a payment is created email is sent
 */
exports.startPayment = catchAsync(async (req, res, next) => {
    const course = await Course.findById(req.body.courseId);
    if (!course) {
        return next(
            new AppError('No se encontró ningún curso con esta clave.', 404)
        );
    }

    if (course.cost == 0) {
        return next(
            new AppError(
                'No necesitas pagar por este curso, inscríbete directamente en /inscribeTo.',
                400
            )
        );
    }

    if (course.startDate < Date.now()) {
        return next(
            new AppError(
                'Este curso ya ha empezado, no puedes inscribirte a él.',
                400
            )
        );
    }

    if (course.capacity == 0) {
        return next(
            new AppError('Ya no hay espacio disponible en este curso.', 400)
        );
    }

    // Check if this user has started payment process to this course
    const existingPayment = await Payment.find({
        course: course._id,
        user: req.user._id,
        // if there is a payment process pending or the user has been accepted they should not be able to start a new process
        status: {
            $in: ['Pendiente', 'Aceptado'],
        },
    });
    if (existingPayment.length > 0) {
        return next(
            new AppError(
                'Ya has empezado tu proceso de pago para este curso.',
                400
            )
        );
    }

    // Update course capacity
    course.capacity = course.capacity - 1;
    await course.save();
    const payment = await Payment.create({
        course: course._id,
        user: req.user._id,
        billImageURL: req.body.billImageURL,
    });

    // Send payment notification email
    payment.populate(['user', 'course']);
    try {
        await new Email(req.user, '', course).sendPaymentStartedAlert();
    } catch (error) {
        return next(
            new AppError(
                'Hemos tenido problemas enviando un correo de confirmación.',
                500
            )
        );
    }

    res.status(200).json({
        status: 'success',
        data: { document: payment },
    });
});

exports.acceptPayment = catchAsync(async (req, res, next) => {
    const paymentId = req.body.paymentId;

    // Check if payment exists
    let payment = await Payment.findById(paymentId).populate([
        'user',
        'course',
    ]);
    if (!payment) {
        return next(
            new AppError(
                'No se encontró ninguna solicitud de pago con este id.',
                404
            )
        );
    }

    // Check if payment is pending
    if (payment.status != 'Pendiente') {
        return next(
            new AppError('La solicitud de este pago ya fue procesada.', 400)
        );
    }

    // Save payment new status
    payment.status = 'Aceptado';
    await payment.save();

    // Create new inscription
    await Inscription.create({
        course: payment.course,
        user: payment.user,
    });

    try {
        // Send payment accepted confirmation email
        await new Email(
            payment.user,
            '',
            payment.course
        ).sendPaymentAcceptedAlert();

        // Send inscription confirmation email
        await new Email(
            payment.user,
            process.env.LANDING_URL,
            payment.course
        ).sendInscriptonAlert();
    } catch (error) {
        return next(
            new AppError(
                'Hemos tenido problemas enviando un correo de confirmación.',
                500
            )
        );
    }

    res.status(200).json({
        status: 'success',
        data: { document: payment },
    });
});

exports.declinePayment = catchAsync(async (req, res, next) => {
    const paymentId = req.body.paymentId;

    // Check if payment exists
    let payment = await Payment.findById(paymentId).populate([
        'user',
        'course',
    ]);
    if (!payment) {
        return next(
            new AppError(
                'No se encontró ninguna solicitud de pago con este id.',
                404
            )
        );
    }

    // Check if payment is pending
    if (payment.status != 'Pendiente') {
        return next(
            new AppError('La solicitud de este pago ya fue procesada.', 400)
        );
    }

    // Save payment new status
    payment.status = 'Rechazado';
    await payment.save();

    // Update course
    await Course.findByIdAndUpdate(payment.course._id, {
        capacity: payment.course.capacity + 1,
    });

    try {
        await new Email(
            payment.user,
            '',
            payment.course
        ).sendPaymentRejectedAlert();
    } catch (error) {
        return next(
            new AppError(
                'Hemos tenido problemas enviando un correo de confirmación.',
                500
            )
        );
    }
    // Send payment rejected confirmation email

    res.status(200).json({
        status: 'success',
        data: { document: payment },
    });
});

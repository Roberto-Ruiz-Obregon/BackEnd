const factory = require('./handlerFactory.controller');
const Payment = require('../models/payments.model');

exports.getAllPayments = factory.getAll(Payment);
exports.getPayment = factory.getOne(Payment, ['user', 'course']);
exports.createPayment = factory.createOne(Payment);

// BUSINESS RULES
// When creating a payment it starts as pending and reduces course capacity by 1
// If payment is rejected, course capacity is augmented by 1
// When a payment is accepted a confirmation mail is sent and inscription is created
// When a payment is created email is sent

exports.startPayment = catchAsync(async (req, res, next) => {
    const course = await Course.findById(req.body.course);
    if (!course) {
        return next(
            new AppError('No se encontro ningun curso con esta clave.', 404)
        );
    }

    if (course.cost == 0) {
        return next(
            new AppError(
                'No necesitas pagar por este curso, inscribete directamente en /inscribeTo.',
                404
            )
        );
    }

    if (course.startDate < Date.now()) {
        return next(
            new AppError(
                'Este curso ya ha empezado, no puedes inscribirte a el.',
                400
            )
        );
    }

    // Check if this user has started payment process to this course
    const payment = await Payment.find({
        course: courseId,
        user: req.user._id,
    });
    if (payment) {
        return next(
            new AppError(
                'Ya haz empezado tu proceso de pago para este curso.',
                400
            )
        );
    }

    // Update course capacity
    course.capacity = course.capacity - 1;
    await course.save();

    await Payment.create(req.body);

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
                'No se encontro ninguna solicitud de pago con este id.',
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

    // Send payment accepted confirmation email

    // Send inscription confirmation email
    await new Email(
        payment.user,
        process.env.LANDING_URL,
        payment.course
    ).sendInscriptonAlert();

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
                'No se encontro ninguna solicitud de pago con este id.',
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

    // Send payment rejected confirmation email

    res.status(200).json({
        status: 'success',
        data: { document: payment },
    });
});

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

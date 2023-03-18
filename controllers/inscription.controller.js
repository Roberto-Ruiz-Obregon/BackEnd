const factory = require('./handlerFactory.controller');
const Inscription = require('../models/inscriptions.model');
const catchAsync = require('../utils/catchAsync');

exports.getAllInscriptions = factory.getAll(Inscription);
exports.getInscription = factory.getOne(Inscription, ['user', 'course']);

// TODO: CREATE CUSTOM MIDDLEWARES TO TAKE INTO ACCOUNT BUSINESS RULES
exports.createInscription = factory.createOne(Inscription);
exports.deleteInscription = factory.deleteOne(Inscription);

exports.inscribeTo = catchAsync(async (req, res, next) => {});

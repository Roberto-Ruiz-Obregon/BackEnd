const factory = require('./handlerFactory.controller');
const Inscription = require('../models/inscriptions.model');

exports.getAllInscriptions = factory.getAll(Inscription);
exports.getInscription = factory.getOne(Inscription, ['user', 'course']);
exports.createInscription = factory.createOne(Inscription);
exports.deleteInscription = factory.deleteOne(Inscription);

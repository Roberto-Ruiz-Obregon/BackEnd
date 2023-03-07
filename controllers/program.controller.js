const factory = require('./handlerFactory.controller');
const Program = require('../models/programs.model');

exports.getAllPrograms = factory.getAll(Program);
exports.getProgram = factory.getOne(Program);
exports.createProgram = factory.createOne(Program);
exports.updateProgram = factory.updateOne(Program);
exports.deleteProgram = factory.deleteOne(Program);

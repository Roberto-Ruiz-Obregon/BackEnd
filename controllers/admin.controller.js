const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require(`../utils/apiFeatures`);
const factory = require('./handlerFactory.controller');
const Admin = require('../models/admins.model');

exports.getAllAdmins = factory.getAll(Admin);
exports.getAdmin = factory.getOne(Admin);
exports.createAdmin = factory.createOne(Admin);
exports.updateAdmin = factory.updateOne(Admin);
exports.deleteAdmin = factory.deleteOne(Admin);

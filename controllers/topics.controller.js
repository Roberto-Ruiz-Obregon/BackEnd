const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require(`../utils/apiFeatures`);
const factory = require('./handlerFactory.controller');
const Topic = require('../models/topics.model');

exports.getAllTopics = factory.getAll(Topic);
exports.getTopic = factory.getOne(Topic);
exports.createTopic = factory.createOne(Topic);
exports.updateTopic = factory.updateOne(Topic);
exports.deleteTopic = factory.deleteOne(Topic);
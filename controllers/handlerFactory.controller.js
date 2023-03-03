// Functions to fabricate controllers
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const APIFeatures = require(`../utils/apiFeatures`);

/* A function that deletes a document from the database. */
exports.deleteOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);

        if (!doc) {
            const error = new AppError('No document found with that ID', 404);
            return next(error);
        }

        res.status(204).json({
            status: 'success',
        });
    });

/* A function that updates a document in the database. */
exports.updateOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const document = await Model.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!document) {
            const error = new AppError('No document found with that ID', 404);
            return next(error);
        }

        res.status(200).json({
            status: 'success',
            data: { document },
        });
    });

/* This is a function that creates a new document in the database. */
exports.createOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const document = await Model.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                document,
            },
        });
    });

/* This is a function that gets a single document from the database. */
exports.getOne = (Model, popOptions) =>
    catchAsync(async (req, res, next) => {
        let query = Model.findById(req.params.id);
        if (popOptions) {
            query.populate(popOptions);
        }
        const document = await query;

        if (!document) {
            const error = new AppError('No document found with that ID', 404);
            return next(error);
        }

        res.status(200).json({
            status: 'success',
            data: {
                document,
            },
        });
    });

exports.getAll = (Model) =>
    catchAsync(async (req, res) => {
        let filter = {};

        const features = new APIFeatures(Model.find(filter), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        const documents = await features.query;

        // SEND RESPONSE
        res.status(200).json({
            status: 'success',
            results: documents.length,
            data: { documents },
        });
    });

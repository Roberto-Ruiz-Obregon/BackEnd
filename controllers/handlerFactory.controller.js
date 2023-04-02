// Functions to fabricate controllers
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const APIFeatures = require(`../utils/apiFeatures`);

/**
 * A function that deletes a document from the database. 
 * o be able to do this, it is necessary to have the '.id' of what we are looking to delete
*/
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


/**
 * A function that updates a document in the database. 
 * To be able to do this, it is necessary to have the '.id' of what we are looking to change,
 * and similarly, we must obtain the '.body' for the update
*/
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

/** 
 *  This is a function that gets a single document from the database. 
 * It is necessary to have the '.id' because it is a unique identifier that all data have. 
*/
exports.getOne = (Model, popOptions = []) =>
    catchAsync(async (req, res, next) => {
        let query = Model.findOne({ _id: req.params.id });
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

/** 
 * This is a function that gets all documents from the database. 
 * It applies filters and other functionalities, and returns the results as a JSON response.
*/
exports.getAll = (Model, popOptions) =>
    catchAsync(async (req, res) => {
        let filter = {};
        let query = Model.find(filter);
        if (popOptions) {
            query.populate(popOptions);
        }
        const features = new APIFeatures(query, req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        const documents = await features.query;

        res.status(200).json({
            status: 'success',
            results: documents.length,
            data: { documents },
        });
    });

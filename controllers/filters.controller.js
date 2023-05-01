const User = require('../models/users.model');
const Topics = require('../models/topics.model');
const Inscription = require('../models/inscriptions.model');
const catchAsync = require('../utils/catchAsync');

// filter by zone with inscriptions to courses added into the same file
exports.getInscriptionsByZone = catchAsync(async (req, res) => {
    const result = await User.aggregate([
        {
            $lookup: {
                from: 'inscriptions',
                localField: '_id',
                foreignField: 'user',
                as: 'inscriptions',
            },
        },
        {
            $unwind: '$inscriptions',
        },
        {
            $lookup: {
                from: 'courses',
                localField: 'inscriptions.course',
                foreignField: '_id',
                as: 'course',
            },
        },
        {
            $unwind: '$course',
        },
        {
            $match: {
                'inscriptions.course': { $exists: true, $ne: [] },
            },
        },
        {
            $group: {
                _id: {
                    postalCode: '$postalCode',
                    course: '$course.courseName',
                },
                totalUsers: { $sum: 1 },
            },
        },
        {
            $group: {
                _id: '$_id.postalCode',
                totalUsers: { $sum: '$totalUsers' },
                courses: { $push: '$_id.course' },
            },
        },
        {
            $sort: { totalUsers: -1 },
        },
    ]);

    res.status(200).json({
        status: 'success',
        data: result,
    });
});

//zones with most users
exports.getZonesWithMostUsers = catchAsync(async (req, res) => {
    const result = await User.aggregate([
        {
            $group: {
                _id: '$postalCode',
                totalUsers: { $sum: 1 },
            },
        },
        {
            $sort: { totalUsers: -1 },
        },
        {
            $project: {
                _id: 0,
                postalCode: '$_id',
                totalUsers: 1,
            },
        },
    ]);

    res.status(200).json({
        status: 'success',
        data: result,
    });
});

exports.filterTopics = catchAsync(async (req, res) => {
    const postalCode = req.body.postalCode;

    const result = await User.aggregate([
        {
            $match: { postalCode: postalCode },
        },
        {
            $lookup: {
                from: 'inscriptions',
                localField: '_id',
                foreignField: 'user',
                as: 'inscriptions',
            },
        },
        {
            $lookup: {
                from: 'courses',
                localField: 'inscriptions.course',
                foreignField: '_id',
                as: 'course',
            },
        },
        {
            $lookup: {
                from: 'topics',
                localField: 'course.topics',
                foreignField: '_id',
                as: 'topics',
            },
        },
        {
            $unwind: '$topics',
        },
        {
            $group: {
                _id: '$topics.topic',
                totalUsers: { $sum: 1 },
            },
        },
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            result,
        },
    });
});

exports.filterInscriptions = catchAsync(async (req, res) => {
    const postalCode = req.body.postalCode;

    const result = await User.aggregate([
        {
            $match: { postalCode: postalCode },
        },
        {
            $lookup: {
                from: 'inscriptions',
                localField: '_id',
                foreignField: 'user',
                as: 'inscriptions',
            },
        },
        {
            $lookup: {
                from: 'courses',
                localField: 'inscriptions.course',
                foreignField: '_id',
                as: 'course',
            },
        },
        {
            $unwind: '$course',
        },
        {
            $group: {
                _id: '$course.courseName',
                totalUsers: { $sum: 1 },
            },
        },
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            result,
        },
    });
});

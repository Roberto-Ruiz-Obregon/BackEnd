const User = require('../models/users.model');
const Topics = require('../models/topics.model');
const Inscription = require('../models/inscriptions.model');
const catchAsync = require('../utils/catchAsync');

//interests by zone
exports.filterTopics = catchAsync(async (req, res) => {
  const { postalCode, topics } = req.body;

  const topicIds = await Topics.find({ topic: { $in: topics } }).distinct('_id');

  const filteredUsers = await User.aggregate([
    {
      $match: {
        postalCode: postalCode,
        topics: { $in: topicIds },
      },
    },
    {
      $lookup: {
        from: 'topics',
        localField: 'topics',
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
        count: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: filteredUsers,
  });
}, (error) => {
  console.log(error);
});


// filter by zone with most inscriptions added into the same file
exports.getZonesWithMostInscriptions = catchAsync(async (req, res) => {
  const result = await Inscription.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $group: {
        _id: '$user.postalCode',
        totalInscriptions: { $sum: 1 },
      },
    },
    {
      $sort: { totalInscriptions: -1 },
    },
    {
      $project: {
        _id: 0,
        postalCode: '$_id',
        totalInscriptions: 1,
      },
    },
  ]);

  res.status(200).json(result);
});

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
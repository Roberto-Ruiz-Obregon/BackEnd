const User = require('../models/users.model');
const Topics = require('../models/topics.model');
const Inscription = require('../models/inscriptions.model');
const catchAsync = require('../utils/catchAsync');

//popular interests by zone
exports.filterTopics =  catchAsync(async (req, res) => {
  const { postalCode } = req.body;

  const popularTopics = await User.aggregate([
    //match by postal code
    {
      $match: {
        postalCode: postalCode,
      },
    },
    {
      $unwind: '$topics',
    },
    {
      $lookup: {
        from: 'topics',
        localField: 'topics',
        foreignField: '_id',
        as: 'topicDetails',
      },
    },
    {
      $unwind: '$topicDetails',
    },
    //group by topics 
    {
      $group: {
        _id: '$topicDetails.topic',
        count: { $sum: 1 },
      },
    },
    //sort in descending order
    {
      $sort: {
        count: -1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: popularTopics,
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

//zones with most users
exports.getzonesWithMostUsers= catchAsync(async (req, res) => {
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
      $group: {
        _id: '$course.courseName',
        totalInscriptions: { $sum: 1 },
      },
    },
    {
      $sort: { totalInscriptions: -1 },
    },
    {
      $project: {
        _id: 0,
        courseName: '$_id',
        totalInscriptions: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: result,
  });
});


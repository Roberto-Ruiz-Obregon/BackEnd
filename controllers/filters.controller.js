const User = require('../models/users.model');
const Topics = require('../models/topics.model');
const Inscription = require('../models/inscriptions.model');
const catchAsync = require('../utils/catchAsync');

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
exports.getZonesWithMostUsers = catchAsync(async (req, res) => {
  const result = await User.aggregate([
    {
      $group: {
        _id: '$postalCode', 
        totalUsers: { $sum: 1},
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

// //popular interests by zone
// exports.filterTopics = catchAsync(async (req, res) => {

//   const { postalCode } = req.body;
//   console.log(postalCode)
 
//   const popularTopics = await User.aggregate([
//     { $match: { postalCode: postalCode } },
//     { $unwind: "$topics" },
//     {
//       $group: {
//         _id: "$topics",
//         count: { $sum: 1 }
//       }
//     },
//     {
//       $group: {
//         _id: null,
//         topics: {
//           $push: {
//             k: "$_id",
//             v: "$count"
//           }
//         }
//       }
//     },
//     {
//       $replaceRoot: {
//         newRoot: {
//           $arrayToObject: "$topics"
//         }
//       }
//     }
//   ])
//   res.status(200).json({
//     status: 'success',
//     data: popularTopics,
//   });
// }, (error) => {
//   console.log(error);
//   res.status(500).json({
//     status: 'error',
//     message: error.message,
//   });
// });




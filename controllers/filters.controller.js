const User = require('../models/users.model');
const Topics = require('../models/topics.model');
const Inscription = require('../models/inscriptions.model');
const catchAsync = require('../utils/catchAsync');

// filter by zone with inscriptions to courses added into the same file
exports.getInscriptionsByZone = catchAsync(async (req, res) => {
  const postalCode = req.params.postalCode;
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
      $unwind: '$inscriptions'
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'inscriptions.course',
        foreignField: '_id',
        as: 'course'
      }
    },
    {
      $unwind: '$course'
    },
    {
      $group: {
        _id: {
          postalCode: '$postalCode',
          courseId: '$course._id',
        },
        courses: { $addToSet: '$course.courseName' },
        totalUsers: { $sum: 1 }
      },
    },
    {
      $group: {
        _id: '$_id.postalCode',
        courses: {
          $addToSet: {
            courseName: '$_id.courseId.courseName',
            totalUsers: { $size: '$totalUsers' }
          }
        },
        totalUsers: { $sum: 1 }
      }
    },
    {
      $match: {
        _id: postalCode,
      },
    },
    {
      $project: {
        _id: 0,
        postalCode: '$_id',
        courses: 1,
        totalUsers: 1
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: result[0],
  });
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




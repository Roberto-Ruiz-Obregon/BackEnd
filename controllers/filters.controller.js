const User = require('../models/users.model');
const Topics = require('../models/topics.model');

exports.filterTopics = async (req, res) => {
  const { postalCode, topics } = req.body;

  try {
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
        //we group by topic field
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
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'error',
      message: 'Ocurrió un error al filtrar usuarios',
    });
  }
};


const User = require('../models/users.model');
const Topics = require('../models/topics.model');
const Inscription = require('../models/inscriptions.model');

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

//filter by zone added into the same file
const getZonesWithMostInscriptions = (req, res, next) => {
  (async () => {
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
    })().catch(next) 
      console.log(error);
      res.status(500).json({ error: 'Error de servidor ' });
  }
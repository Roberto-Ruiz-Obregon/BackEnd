const Inscription = require('../models/inscriptions.model');

async function getZonesWithMostInscriptions(req, res) {
    try {
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
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error de servidor ' });
    }
  }
  
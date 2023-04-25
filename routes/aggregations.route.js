const express = require('express');
const {
  filterTopics,
  getInscriptionsByZone,
  getZonesWithMostUsers,
} = require('../controllers/filters.controller'); 

const router = express.Router();

router.post('/filter-topics', filterTopics);
router.get('/inscriptions-by-zone', getInscriptionsByZone);
router.get('/zones-most-users', getZonesWithMostUsers);

module.exports = router;

const express = require('express');
const {
  filterTopics,
  getZonesWithMostInscriptions,
  getZonesWithMostUsers,
} = require('../controllers/filters.controller'); 

const router = express.Router();

// router.post('/filter-topics', filterTopics);
router.get('/zones-most-inscriptions', getZonesWithMostInscriptions);
router.get('/zones-most-users', getZonesWithMostUsers);

module.exports = router;

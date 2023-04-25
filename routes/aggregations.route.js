const express = require('express');
const {
    filterTopics,
    filterInscriptions,
    getInscriptionsByZone,
    getZonesWithMostUsers,
} = require('../controllers/filters.controller');

const router = express.Router();

router.post('/filter-topics', filterTopics);
router.post('/filter-inscriptions', filterInscriptions);
router.get('/inscriptions-by-zone', getInscriptionsByZone);
router.get('/zones-most-users', getZonesWithMostUsers);

module.exports = router;

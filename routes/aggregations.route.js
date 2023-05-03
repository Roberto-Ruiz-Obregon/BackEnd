const express = require('express');
const {
    filterTopics,
    filterInscriptions,
    getInscriptionsByZone,
    getZonesWithMostUsers,
} = require('../controllers/filters.controller');
const {
    protect,
    restrictTo,
} = require(`${__dirname}/../controllers/authentication.controller.js`);

const router = express.Router();

router.use(protect, restrictTo('Admin'));
router.post('/filter-topics', filterTopics);
router.post('/filter-inscriptions', filterInscriptions);
router.get('/inscriptions-by-zone', getInscriptionsByZone);
router.get('/zones-most-users', getZonesWithMostUsers);

module.exports = router;

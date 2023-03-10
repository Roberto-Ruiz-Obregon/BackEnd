const express = require('express');
const router = express.Router();

const { getOverview } = require('../controllers/views.controller');

router.get('/', getOverview);

module.exports = router;

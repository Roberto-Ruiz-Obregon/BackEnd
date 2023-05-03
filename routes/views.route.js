const express = require('express');
const router = express.Router();

const {
    getOverview,
    resetPassword,
} = require('../controllers/views.controller');

router.get('/', getOverview);
router.get('/retrievePassword/:user/:id', resetPassword);

module.exports = router;

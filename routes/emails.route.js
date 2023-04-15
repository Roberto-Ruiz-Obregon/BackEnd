const express = require('express');
const filesController = require('../controllers/files.controller');

const router = express.Router();

const {
    sendToEveryone,
    sendByZone,
} = require(`${__dirname}/../controllers/emails.controller.js`);
const {
    protect,
    restrictTo,
} = require(`${__dirname}/../controllers/authentication.controller.js`);

const fileParser = require('../utils/multipartParser');

router.use(protect);
router.use(restrictTo('Admin'));
router
    .route('/emailToEveryone')
    .post(restrictTo('Admin'), fileParser, filesController.formatEmailImage, sendToEveryone);
router
    .route('/emailByZone')
    .post(restrictTo('Admin'), fileParser, filesController.formatEmailImage, sendByZone);

module.exports = router;

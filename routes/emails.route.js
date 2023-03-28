const express = require('express');
const filesController = require('../controllers/files.controller');

const router = express.Router();

const {
    sendToEveryone,
    sendByZone,
} = require(`${__dirname}/../controllers/emails.controller.js`);
const fileParser = require('../utils/multipartParser');

router
    .route('/emailToEveryone')
    .post(fileParser, filesController.formatEmailImage, sendToEveryone);
router
    .route('/emailByZone')
    .post(fileParser, filesController.formatEmailImage, sendByZone);

module.exports = router;

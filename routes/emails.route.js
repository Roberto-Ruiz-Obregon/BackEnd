const express = require('express');
const filesController = require('../controllers/files.controller');

const router = express.Router();

const {
    sendToEveryone,
    sendByZone,
} = require(`${__dirname}/../controllers/emails.controller.js`);

router
    .route('/emailToEveryone')
    .post(
        filesController.uploadEmailImage,
        filesController.formatEmailImage,
        sendToEveryone
    );
router
    .route('/emailByZone')
    .post(
        filesController.uploadEmailImage,
        filesController.formatEmailImage,
        sendByZone
    );

module.exports = router;

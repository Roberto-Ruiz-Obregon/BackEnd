const express = require('express');
const filesController = require('../controllers/files.controller');

const router = express.Router();

const {
    sendToEveryone,
} = require(`${__dirname}/../controllers/emails.controller.js`);

router
    .route('/emailToEveryone')
    .post(
        filesController.uploadEmailImage,
        filesController.formatEmailImage,
        sendToEveryone);

module.exports = router;

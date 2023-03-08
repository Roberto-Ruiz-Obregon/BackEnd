const express = require('express');
const filesController = require('../controllers/files.controller');

const router = express.Router();

// RUTAS
const {
    createPayment,
    getPayment,
    getAllPayments,
} = require(`${__dirname}/../controllers/payment.controller.js`);

router
    .route('/')
    .get(getAllPayments)
    .post(
        createPayment,
        filesController.uploadPaymentImage,
        filesController.formatPaymentImage
    );
router.route('/:id').get(getPayment);

module.exports = router;

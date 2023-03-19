const express = require('express');
const filesController = require('../controllers/files.controller');

const router = express.Router();

// RUTAS
const {
    createPayment,
    getPayment,
    getAllPayments,
    startPayment,
    acceptPayment,
    declinePayment,
} = require(`${__dirname}/../controllers/payment.controller.js`);
const {
    protect,
    restrictTo,
} = require(`${__dirname}/../controllers/authentication.controller.js`);

router.use(protect);
router
    .route('/startPayment')
    .post(
        restrictTo('User'),
        filesController.uploadPaymentImage,
        filesController.formatPaymentImage,
        startPayment
    );
router.use(restrictTo('Admin'));
router.route('/acceptPayment').post(acceptPayment);
router.route('/declinePayment').post(declinePayment);

router
    .route('/')
    .get(getAllPayments)
    .post(
        filesController.uploadPaymentImage,
        filesController.formatPaymentImage,
        createPayment
    );
router.route('/:id').get(getPayment);

module.exports = router;

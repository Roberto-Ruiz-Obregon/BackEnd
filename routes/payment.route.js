const express = require('express');
const router = express.Router();

// RUTAS
const {
    createPayment,
    getPayment,
    getAllPayments,
} = require(`${__dirname}/../controllers/payment.controller.js`);

router.route('/').get(getAllPayments).post(createPayment);
router.route('/:id').get(getPayment);

module.exports = router;

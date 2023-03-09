const express = require('express');
const router = express.Router();

// RUTAS
const {
    createInscription,
    getInscription,
    getAllInscriptions,
    deleteInscription,
} = require(`${__dirname}/../controllers/inscription.controller.js`);

router.route('/').get(getAllInscriptions).post(createInscription);
router.route('/:id').get(getInscription).delete(deleteInscription);

module.exports = router;

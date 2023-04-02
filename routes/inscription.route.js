const express = require('express');
const router = express.Router();

const {
    createInscription,
    getInscription,
    getAllInscriptions,
    deleteInscription,
    inscribeTo,
    myInscriptions,
} = require(`${__dirname}/../controllers/inscription.controller.js`);
const {
    protect,
    restrictTo,
} = require(`${__dirname}/../controllers/authentication.controller.js`);

router.use(protect);
router.route('/inscribeTo').post(restrictTo('User'), inscribeTo);
router.route('/myInscriptions').get(restrictTo('User'), myInscriptions);

router.use(restrictTo('Admin'));
router.route('/').get(getAllInscriptions).post(createInscription);
router.route('/:id').get(getInscription).delete(deleteInscription);

module.exports = router;

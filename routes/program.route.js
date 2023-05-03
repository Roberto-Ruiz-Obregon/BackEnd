const express = require('express');
const filesController = require('../controllers/files.controller');

const router = express.Router();

const {
    createProgram,
    getProgram,
    getAllPrograms,
    updateProgram,
    deleteProgram,
} = require(`${__dirname}/../controllers/program.controller.js`);
const {
    protect,
    restrictTo,
} = require(`${__dirname}/../controllers/authentication.controller.js`);
const fileParser = require('../utils/multipartParser');

router
    .route('/')
    .get(getAllPrograms)
    .post(
        protect,
        restrictTo('Admin'),
        fileParser,
        filesController.formatProgramImage,
        createProgram
    );
router
    .route('/:id')
    .get(getProgram)
    .patch(
        protect,
        restrictTo('Admin'),
        fileParser,
        filesController.formatProgramImage,
        updateProgram
    )
    .delete(protect, restrictTo('Admin'), deleteProgram);

module.exports = router;

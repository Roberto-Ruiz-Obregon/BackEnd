const express = require('express');
const filesController = require('../controllers/files.controller');

const router = express.Router();

// RUTAS
const {
    createProgram,
    getProgram,
    getAllPrograms,
    updateProgram,
    deleteProgram,
} = require(`${__dirname}/../controllers/program.controller.js`);
const fileParser = require('../utils/multipartParser');

router
    .route('/')
    .get(getAllPrograms)
    .post(fileParser, filesController.formatProgramImage, createProgram);
router
    .route('/:id')
    .get(getProgram)
    .patch(fileParser, filesController.formatProgramImage, updateProgram)
    .delete(deleteProgram);

module.exports = router;

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

router
    .route('/')
    .get(getAllPrograms)
    .post(
        filesController.uploadProgramImage,
        filesController.formatProgramImage,
        createProgram
    );
router.route('/:id').get(getProgram).patch(updateProgram).delete(deleteProgram);

module.exports = router;

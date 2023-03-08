const express = require('express');
const filesController = require('../controllers/files.controller');

const router = express.Router();

// RUTAS
const {
    getAllCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
} = require(`${__dirname}/../controllers/course.controller.js`);

router
    .route('/')
    .get(getAllCourses)
    .post(
        filesController.uploadCourseImage,
        filesController.formatCourseImage,
        createCourse
    );
router
    .route('/:id')
    .get(getCourse)
    .patch(
        filesController.uploadCourseImage,
        filesController.formatCourseImage,
        updateCourse
    )
    .delete(deleteCourse);

module.exports = router;

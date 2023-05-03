const express = require('express');
const filesController = require('../controllers/files.controller');

const router = express.Router();

const {
    getAllCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    inscriptionByCourse,
} = require(`${__dirname}/../controllers/course.controller.js`);
const {
    protect,
    restrictTo,
} = require(`${__dirname}/../controllers/authentication.controller.js`);
const fileParser = require('../utils/multipartParser');

router.route('/getInscriptions/:id').get(inscriptionByCourse);

router
    .route('/')
    .get(getAllCourses)
    .post(
        protect,
        restrictTo('Admin'),
        fileParser,
        filesController.formatCourseImage,
        createCourse
    );
router
    .route('/:id')
    .get(getCourse)
    .patch(
        protect,
        restrictTo('Admin'),
        fileParser,
        filesController.formatCourseImage,
        updateCourse
    )
    .delete(protect, restrictTo('Admin'), deleteCourse);

module.exports = router;

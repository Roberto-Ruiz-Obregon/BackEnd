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

router.use(protect);
router.route('/getInscriptions/:id').get(restrictTo('Admin'), inscriptionByCourse);
router
    .route('/')
    .get(getAllCourses)
    .post(restrictTo('Admin'), fileParser, filesController.formatCourseImage, createCourse);
router
    .route('/:id')
    .get(getCourse)
    .patch(restrictTo('Admin'), fileParser, filesController.formatCourseImage, updateCourse)
    .delete(restrictTo('Admin'), deleteCourse);

module.exports = router;

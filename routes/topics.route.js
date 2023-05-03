const express = require('express');

const router = express.Router();

const {
    getAllTopics,
    getTopic,
    createTopic,
    updateTopic,
    deleteTopic,
} = require(`${__dirname}/../controllers/topics.controller.js`);
const {
    protect,
    restrictTo,
} = require(`${__dirname}/../controllers/authentication.controller.js`);

router
    .route('/')
    .get(getAllTopics)
    .post(protect, restrictTo('Admin'), createTopic);
router
    .route('/:id')
    .get(getTopic)
    .patch(protect, restrictTo('Admin'), updateTopic)
    .delete(protect, restrictTo('Admin'), deleteTopic);

module.exports = router;

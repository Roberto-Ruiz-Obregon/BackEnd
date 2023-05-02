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

router.use(protect);
router.route('/').get(getAllTopics).post(restrictTo('Admin'),createTopic);
router.route('/:id').get(getTopic).patch(restrictTo('Admin'),updateTopic).delete(restrictTo('Admin'),deleteTopic);

module.exports = router;
const express = require('express');

const router = express.Router();

// RUTAS
const {
    getAllTopics,
    getTopic,
    createTopic,
    updateTopic,
    deleteTopic,
} = require(`${__dirname}/../controllers/topics.controller.js`);

router.route('/').get(getAllTopics).post(createTopic);
router.route('/:id').get(getTopic).patch(updateTopic).delete(deleteTopic);

module.exports = router;
const express = require('express');

const router = express.Router();

// RUTAS
const {
    getAllTopicss,
    getTopics,
    createTopics,
    updateTopics,
    deleteTopics,
} = require(`${__dirname}/../controllers/topics.controller.js`);

router.route('/').get(getAllTopicss).post(createTopics);
router.route('/:id').get(getTopics).patch(updateTopics).delete(deleteTopics);

module.exports = router;
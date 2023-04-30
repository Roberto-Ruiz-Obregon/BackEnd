const { topic } = require('firebase-functions/v1/pubsub');
const mongoose = require('mongoose');

const topicsSchema = new mongoose.Schema({
    topic: {
        type: String,
        required: [true, 'Se necesita al menos un interés'],
        unique: [true, 'Este interés ya existe. Elige otro.'],
    },
});


topicsSchema.pre('findByIdAndDelete', async function () {
    const User = require('../models/users.model')
    const Course = require('../models/courses.model')

    // obtain the topic that is going to be deleted
    const topic = this;

    await User.updateMany(
        {topics: topic._id },
        {$pullAll: {topics: topic._id}}
    );

    await Course.updateMany(
        // search the ones that have this topic
        {topics: topic._id },
        // delete the topic from the course
        {$pullAll: {topics: topic._id}}
    );
    // delete the topic 
    await Topics.deleteOne({_id: topic._id});
});

const Topics = mongoose.model('Topics', topicsSchema);

module.exports = Topics;

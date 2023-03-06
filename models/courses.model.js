const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
    },
    // what is the course about
    description: {
        type: Number,
    },
    // people/corps who are teaching the course
    teachers: {
        type: String,
    },
    // course beginning date
    startDate: {
        type: Date,
    },
    // course final date
    endDate: {
        type: Date,
    },
    // TODO! course hours do they change schedules?
    schedule: {
        type: String,
    },
    // session time span
    duration: {
        type: Number,
    },
    // additional class material
    accessLink: {
        type: String,
    },
    // access code/password assigned to the course
    accessCode: {
        type:  String,
    },
    // link to zoom meeting
    zoomLink: {
        type: String,
    },
    // remote, hybrid, presential, etc.
    modality: {
        type: String,
    }
});

const Courses = mongoose.model('Course', courseSchema);

module.exports = Courses;
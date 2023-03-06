const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: [true, 'Nombre de curso requerido'],
    },
    topic: {
        type: String,
    },
    description: {
        type: String,
    },
    teachers: {
        type: String,
        required: [true, 'Es necesario asignar profesores al curso'],
    },
    startDate: {
        type: Date,
        required: [true, 'Fecha de inicio requerida'],
    },
    endDate: {
        type: Date,
        required: [true, 'Fecha fin requerida'],
        validate: {
            validator: endDate => endDate >= this.startDate,
            message: 'La fecha fin no puede ser antes de la fecha de inicio'
        }
    },
    schedule: {
        type: Date,
    },
    duration: {
        type: Number,
        validate : {
            validator: value => value > 0 && Number.isInteger(value),
            message: 'La duración debe de ser un número entero positivo'
        }
    },
    accessLink: {
        type: String,
        validate: {
            validator: value => (
                /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(value)
            ),
            message: props => `${props.value} no es una URL válida`
        }
    },
    accessCode: {
        type:  String,
    },
    zoomLink: {
        type: String,
        validate: {
            validator: value => (
                /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(v)
            ),
            message: props => `${props.value} no es una URL válida`
        }
    },
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
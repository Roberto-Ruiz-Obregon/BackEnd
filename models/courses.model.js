const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const AppError = require('../utils/appError');

const courseSchema = new mongoose.Schema(
    {
        courseName: {
            type: String,
            required: [true, 'Nombre de curso requerido'],
        },
        // what is the course about
        description: {
            type: String,
        },
        topics: {
            type: [mongoose.Schema.ObjectId],
            ref: 'Course',
        },
        // people/corps who are teaching the course
        teachers: {
            type: [String],
            required: [true, 'Es necesario asignar profesores al curso'],
        },
        // course beginning date
        startDate: {
            type: Date,
            required: [true, 'Fecha de inicio requerida'],
        },
        // course final date
        endDate: {
            type: Date,
            required: [true, 'Fecha fin requerida'],
        },
        // // TO-DO? course hours do they change schedules?
        // schedule: {
        //     type: String,
        // },
        // session time span in minutes
        duration: {
            type: Number,
            validate: {
                validator: (value) => value > 0 && Number.isInteger(value),
                message: 'La duración debe de ser un número entero positivo',
            },
        },
        // additional class material
        accessLink: {
            type: String,
            validate: {
                validator: (value) =>
                    /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(value),
                message: (props) => `${props.value} no es una URL válida`,
            },
        },
        // access code/password assigned to the course
        accessCode: {
            type: String,
        },
        // link to zoom meeting
        zoomLink: {
            type: String,
            validate: {
                validator: (value) =>
                    /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(value),
                message: (props) => `${props.value} no es una URL válida`,
            },
        },
        // remote, presential, etc.
        modality: {
            type: String,
            enum: { values: ['Remoto', 'Presencial'] },
            required: [
                true,
                'Modalidad del curso debe ser presencial o remoto',
            ],
        },
        postalCode: {
            type: String,
        },
        // free or paid
        status: {
            type: String,
            required: [true, 'El curso debe ser gratuito o de pago'],
            enum: { values: ['Gratuito', 'Pagado'] },
        },
        // inscription cost for course access
        cost: {
            type: Number,
            validate: {
                validator: (cost) => cost >= 0 && Number.isInteger(cost),
                message: 'El curso debe costar 0 o más',
            },
        },
        imageUrl: {
            type: String,
            required: [true, 'Tu curso debe contar con una portada'],
            validate: {
                validator: (value) =>
                    /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(value),
            },
        },
        capacity: {
            type: Number,
            default: 10,
            validate: {
                validator: (value) => value > 0,
            },
        },
    },
    { timestamps: true }
);

// date validation
courseSchema.pre('validate', function () {
    if (this.endDate < this.startDate) {
        throw new AppError(
            'La fecha final debe ser menor a la fecha inicial',
            400
        );
    }
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;

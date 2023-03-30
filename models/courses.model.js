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
        topics: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'Topics',
            },
        ],
        // people/corps who are teaching the course
        teacher: {
            type: String,
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
        // TO-DO? course hours do they change schedules?
        schedule: {
            type: String,
            required: [true, 'Necesitas ingresar el horario del curso'],
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
            required: [true, 'Un curso debe tener un codigo postal.'],
        },
        address: {
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
                validator: (value) => value >= 0,
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

courseSchema.pre('remove', async function (next) {
    const Inscription = require('../models/inscriptions.model')
    const Payment = require('../models/payments.model')
    // delete the payments related with this course
    await Payment.deleteMany({
        course: this._id
    })
    // delete every inscription related with this course id
    await Inscription.deleteMany({
        course: this._id});
    // then the course is going to be deleted too
    return next();
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;

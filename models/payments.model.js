const mongoose = require('mongoose');

/*  This is the model for a payment receipt, not an invoice nor a bill
    * invoice: request for payment (contización)
    * receipt: proof that the invoice was fulfilled
    * bill: proof that a payment was made, normally issued by the billing platform
*/
const paymentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Usuario necesario'],
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: [true, 'Curso necesario'],
        },
        // TODO: que este campo sea read_only desde el front ybi que lo rellene el controlador dependiendo de lo que diga Stripe
        status: {
            type: String,
            enum: { values: ['Pendiente', 'Rechazado', 'Aceptado'] },
            required: [true, 'Status required'],
            default: 'Pendiente',
        },
        billImageURL: {
            type: String,
            validate: {
                validator: (value) =>
                    /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(value),
                message: (props) => `${props.value} no es una URL válida`,
            },
            required: [true, 'Se necesita un comprobante de pago.'],
        },
        // TODO: see how integrating with Stripe will affect this model
    },
    { timestamps: true }
);

// Indexing payment properties for optimized search 
paymentSchema.index({ status: 1 });
paymentSchema.index({ course: 1 });
paymentSchema.index({ user: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;

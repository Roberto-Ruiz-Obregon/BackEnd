const dotenv = require('dotenv');
const functions = require('firebase-functions');
const mongoose = require('mongoose');

// Read env variables and save them
dotenv.config({ path: './config.env' });

// Error catching
process.on('unhandledException', (err) => {
    console.log('UNHANDLED EXCEPTION!: SHUTTING DOWN');
    console.log(err.name, err.message);
    console.log(err);
    process.exit(1);
});

// Connect using mongoose
const DB = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
).replace('<user>', process.env.DATABASE_USER);

// Connection
mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
    })
    .then((con) => {
        console.log('Connection to DB successful');
    })
    .catch((err) => console.log('Connection to DB rejected', err));

const app = require(`${__dirname}/app.js`);

const port = 3000;

// app.listen nos regresa un objeto de
const server = app.listen(port, () => {
    console.log(`Server running on ${port}...`);
});

// UNHANDLED REJECTION
/* Catching unhandled rejections. */
process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message);
    console.log('UNHANDLED REJECTION!: SHUTTING DOWN');
    server.close(() => {
        process.exit(1);
    });
});

// SERVER SHUTDOWN
/* A signal that is sent to the process to tell it to terminate. */
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down.');
    server.close(() => {
        console.log('Process terminated.');
    });
});

exports.api = functions.https.onRequest(app);

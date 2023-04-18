const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Read env variables and save them
dotenv.config({ path: './config.env' });

let mongo = null;

const connectDB = async () => {
    const DB = process.env.DATABASE.replace(
        '<password>',
        process.env.DATABASE_PASSWORD
    ).replace('<user>', process.env.DATABASE_USER);

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
};

module.exports = { connectDB };

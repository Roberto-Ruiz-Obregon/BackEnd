const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { format } = require('util');

const firebase = require('../db'); // reference to our db
require('firebase/storage'); // must be required for this to work
const storage = firebase.storage().ref(); // create a reference to storage
global.XMLHttpRequest = require('xhr2');

/**
 *
 * @param { File } object file object that will be uploaded
 * @param { resource } string name of object property to set URL
 * @description - This function does the following
 * - It uploads a file to storage on Firebase
 * - It accepts an object as an argument with the
 *   "originalname" and "buffer" as keys
 */

const uploadImage = async (file, resource) => {
    let { originalname, buffer } = file;

    // Format the filename
    const timestamp = Date.now();
    const name = originalname.split('.')[0];
    const type = originalname.split('.')[1];
    const fileName = `${name}_${timestamp}.${type}`;
    // Step 1. Create reference for file name in cloud storage
    const imageRef = storage.child(fileName);
    // Step 2. Upload the file in the bucket storage
    const snapshot = await imageRef.put(buffer);
    // Step 3. Grab the public url
    const downloadURL = await snapshot.ref.getDownloadURL();

    return downloadURL;
};

/**
 * This function creates a multer object that will be used to upload images to the server.
 * @returns an object with two properties: storage and filter.
 */
const createUpload = () => {
    const multerStorage = multer.memoryStorage();

    const multerFilter = (req, file, cb) => {
        if (file.mimetype.startsWith('image')) {
            cb(null, true);
        } else {
            cb(
                new AppError(
                    'El archivo no es una imagen. Intenta de nuevo.',
                    404
                ),
                false
            );
        }
    };
    return multer({ storage: multerStorage, filter: multerFilter });
};

exports.formatCourseImage = catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    // FORMAT file
    req.body[resource] = await uploadImage(req.file, 'course');

    next();
});

exports.formatProgramImage = catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    // FORMAT file
    req.body.imageUrl = await uploadImage(req.file, 'program');

    next();
});

exports.formatPaymentImage = catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    // FORMAT file
    req.body.billImageURL = await uploadImage(req.file, 'billImageURL');

    next();
});

exports.uploadCourseImage = createUpload().single('course_image');
exports.uploadProgramImage = createUpload().single('program_image');
exports.uploadPaymentImage = createUpload().single('payment_image');
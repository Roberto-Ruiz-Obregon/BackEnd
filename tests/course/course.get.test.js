const request = require('supertest');
const app = require('../../app');
const db = require('../config/databaseTest');
const { connectDB } = require('../config/databaseProd');

const agent = request.agent(app);

const testCourseNameSearch = (nameTest) => async () => {
    const res = await agent
        .get(`/v1/course?courseName[regex]=${nameTest}&limit=8`)
        .send();

    expect(res.statusCode).toEqual(200);

    res.body.data.documents.forEach((course) => {
        expect(true).toEqual(course.courseName.includes(nameTest));
    });
};

const testCourseCategorySearch = (modality) => async () => {
    const res = await agent
        .get(`/v1/course?modality[regex]=${modality}&limit=8`)
        .send();

    expect(res.statusCode).toEqual(200);

    res.body.data.documents.forEach((course) => {
        expect(true).toEqual(course.modality.includes(modality));
    });
};

const testCourseStatusSearch = (status) => async () => {
    const res = await agent
        .get(`/v1/course?status[regex]=${status}&limit=8`)
        .send();

    expect(res.statusCode).toEqual(200);

    res.body.data.documents.forEach((course) => {
        expect(true).toEqual(course.status.includes(status));
    });
};

const testCoursePostalCodeSearch = (postalCode) => async () => {
    const res = await agent
        .get(`/v1/course?postalCode[regex]=${postalCode}&limit=8`)
        .send();

    expect(res.statusCode).toEqual(200);

    res.body.data.documents.forEach((course) => {
        expect(true).toEqual(course.postalCode.includes(postalCode));
    });
};

beforeAll(async () => {
    await connectDB();
});

describe('Course gets APIFeatures', () => {
    describe('GET /course?courseName[regex]', () => {
        test('successful', testCourseNameSearch('Taller'));
        test('successful', testCourseNameSearch('Curso'));
        test('successful', testCourseNameSearch(''));
    });

    describe('GET /course?postalCode[regex]', () => {
        test('successful', testCoursePostalCodeSearch('42400'));
        test('successful', testCoursePostalCodeSearch('120334'));
        test('successful', testCoursePostalCodeSearch('76000'));
    });

    describe('GET /course?modality[regex]', () => {
        test('successful', testCourseCategorySearch('Remoto'));
        test('successful', testCourseCategorySearch('Presencial'));
        test('successful', testCourseNameSearch(''));
    });

    describe('GET /course?status[regex]', () => {
        test('successful', testCourseStatusSearch('Gratuito'));
        test('successful', testCourseStatusSearch('Pagado'));
        test('successful', testCourseStatusSearch(''));
    });
});

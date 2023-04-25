const request = require('supertest');
const app = require('../../app');
const db = require('../config/databaseTest');
const { connectDB } = require('../config/databaseProd');

const agent = request.agent(app);

const testProgramNameSearch = (nameTest) => async () => {
    const res = await agent
        .get(`/v1/program?courseName[regex]=${nameTest}&limit=8`)
        .send();

    expect(res.statusCode).toEqual(200);

    res.body.data.documents.forEach((program) => {
        expect(true).toEqual(program.programName.includes(nameTest));
    });
};

const testCategorySearch = (category) => async () => {
    const res = await agent
        .get(`/v1/program?category[regex]=${category}&limit=8`)
        .send();

    expect(res.statusCode).toEqual(200);

    res.body.data.documents.forEach((program) => {
        expect(true).toEqual(program.category.includes(category));
    });
};

beforeAll(async () => {
    await connectDB();
});

describe('Program gets APIFeatures', () => {
    describe('GET /program?programName[regex]', () => {
        test('successful', testProgramNameSearch('Amealco'));
        test('successful', testProgramNameSearch('paisajes'));
        test('successful', testProgramNameSearch(''));
    });

    describe('GET /program?category[regex]', () => {
        test('successful', testCategorySearch('Beca'));
        test('successful', testCategorySearch('Evento'));
        test('successful', testCategorySearch('Apoyo'));
        test('successful', testCategorySearch('Programa'));
        test('successful', testCategorySearch('Otro'));
        test('successful', testCategorySearch('NoValido'));
    });
});

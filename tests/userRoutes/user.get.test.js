const request = require('supertest');
const app = require('../../app');
const db = require('../config/databaseTest');
const { connectDB } = require('../config/databaseProd');

const agent = request.agent(app);

const testUserNameSearch = (nameTest) => async () => {
    const res = await agent
        .get(`/v1/user?username[regex]=${nameTest}&limit=8`)
        .send();

    expect(res.statusCode).toEqual(200);

    res.body.data.documents.forEach((user) => {
        expect(true).toEqual(user.username.includes(nameTest));
    });
};

const testUserAgeSearch = (ageTest) => async () => {
    const res = await agent
        .get(`/v1/user?userage[regex]=${ageTest}&limit=8`)
        .send();

    expect(res.statusCode).toEqual(200);

    res.body.data.documents.forEach((user) => {
        expect(true).toEqual(user.userage.includes(ageTest));
    });
};

beforeAll(async () => {
    await connectDB();
});

describe('User gets APIFeatures', () => {
    describe('GET /user?username[regex]', () => {
        test('successful', testUserNameSearch('Dummy'));
        test('successful', testUserNameSearch('John'));
        test('successful', testUserNameSearch('Thomas'));
        test('successful', testUserNameSearch(''));
    });

    describe('GET /user?age[regex]', () => {
        test('successful', testUserAgeSearch('18'));
        test('successful', testUserAgeSearch('19'));
        test('successful', testUserAgeSearch('20'));
        test('successful', testUserAgeSearch(''));
    });
});

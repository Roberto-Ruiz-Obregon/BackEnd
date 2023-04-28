const request = require('supertest');
const app = require('../../app');
const {
    connectDB,
    dropDB,
    dropCollections,
} = require('../config/databaseTest');
const { createUser } = require('../config/dataBaseTestSetUp');
const { loginUser } = require('../config/authSetUp');

const agent = request.agent(app);

beforeAll(async () => {
    await connectDB();
    await createUser();
    // Will set header to allow access to protected and restricted routes
    await loginUser(agent, 'dummy_user@gmail.com', 'contra123');
});

afterAll(async () => {
    await dropCollections();
    await dropDB();
});

const userUpdateTest = (fieldName, value) => async () => {
    const update = {};
    update[fieldName] = value;

    const res = await agent.patch('/v1/user/auth/updateme').send(update);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeTruthy();
    expect(res.body.data.user[fieldName]).toEqual(value);

    expect(res.body.data.user.email).toEqual('dummy_user@gmail.com');
};

describe('User get me', () => {
    describe('Successful user get me /v1/user/auth/me', () => {
        test('successful', async () => {
            const res = await agent.get('/v1/user/auth/me').send();

            expect(res.statusCode).toEqual(200);
            expect(res.body).toBeTruthy();
            expect(res.body.data.document.email).toEqual(
                'dummy_user@gmail.com'
            );
        });
    });
    describe('Successful user edit me /v1/user/auth/updateme', () => {
        test('successful', userUpdateTest('name', 'Carlos'));
        test('successful', userUpdateTest('age', 25));
        test('successful', userUpdateTest('postalCode', 24300));
        test('successful', userUpdateTest('educationLevel', 'Primaria'));
    });
});

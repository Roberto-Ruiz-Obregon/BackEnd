const request = require('supertest');
const app = require('../../app');
const {
    connectDB,
    dropDB,
    dropCollections,
} = require('../config/databaseTest');
const { createUser, createAdmin } = require('../config/dataBaseTestSetUp');
const { loginAdmin, loginUser } = require('../config/authSetUp');

const agent = request.agent(app);

beforeAll(async () => {
    await connectDB();
    await createAdmin();
    // Will set header to allow access to protected and restricted routes
    await loginAdmin(agent, 'dummy_admin@gmail.com', 'contra123');
});

afterAll(async () => {
    await dropCollections();
    await dropDB();
});
// Tests are run in order, since collections are cleaned afterAll, any modification, creation or deletion will persist
// If we want all collections to reset after a single test we remove dropCollecrions from afterAll and add it to afterEach.
// afterEach(async () => {
//     await dropCollections();
// });

describe('Topic post', () => {
    describe('Successful POST /v1/topics', () => {
        test('successful', async () => {
            const res = await agent.post('/v1/topics').send({ topic: 'Test' });
            expect(res.statusCode).toEqual(201);
            expect(res.body).toBeTruthy();
        });
    });
    describe('Error POST /v1/topics due to duplicate topic', () => {
        test('successful', async () => {
            const res = await agent.post('/v1/topics').send({ topic: 'Test' });
            expect(res.statusCode).toEqual(400);
            expect(res.body).toBeTruthy();
        });
    });
    describe('Error POST /v1/topics due to missing topic', () => {
        test('successful', async () => {
            const res = await agent.post('/v1/topics').send();
            expect(res.statusCode).toEqual(400);
            expect(res.body).toBeTruthy();
        });
    });
});

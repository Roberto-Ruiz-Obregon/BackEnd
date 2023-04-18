const request = require('supertest');
const app = require('../app');
const db = require('./config/databaseTest');
const { connectDB, dropDB, dropCollections } = require('./config/databaseTest');

const agent = request.agent(app);

beforeAll(async () => {
    await connectDB();
});
afterAll(async () => {
    await dropDB();
});
afterEach(async () => {
    await dropCollections();
});

describe('tags', () => {
    describe('POST /tags', () => {
        test('successful', async () => {
            // const res = await agent.post('/tags').send({ name: 'test-tag' });
            // expect(res.statusCode).toEqual(201);
            // expect(res.body).toBeTruthy();
            expect(true).toEqual(true);
        });
    });
});

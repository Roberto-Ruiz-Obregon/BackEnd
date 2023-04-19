const request = require('supertest');
const app = require('../../app');
const {
    connectDB,
    dropDB,
    dropCollections,
} = require('../config/databaseTest');

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

describe('Topic post', () => {
    describe('Successful POST /v1/topics', () => {
        console.log(process.env.NODE_ENV);
        test('successful', async () => {
            const res = await agent.post('/v1/topics').send({ topic: 'Test' });
            expect(res.statusCode).toEqual(201);
            expect(res.body).toBeTruthy();
        });
    });
    describe('Error POST /v1/topics', () => {
        test('successful', async () => {
            await agent.post('/v1/topics').send({ topic: 'Test' });
            const res = await agent.post('/v1/topics').send({ topic: 'Test' });
            expect(res.statusCode).toEqual(400);
            expect(res.body).toBeTruthy();
        });
    });
});

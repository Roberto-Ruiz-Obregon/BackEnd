const request = require('supertest');
const app = require('../../app');
const db = require('../config/databaseTest');
const { connectDB } = require('../config/databaseProd');

const agent = request.agent(app);

const testTopicSearch = (topicTest) => async () => {
    const res = await agent
        .get(`/v1/topics?topic[regex]=${topicTest}&limit=8`)
        .send();

    expect(res.statusCode).toEqual(200);

    res.body.data.documents.forEach((topics) => {
        expect(true).toEqual(topics.topic.includes(topicTest));
    });
};

beforeAll(async () => {
    await connectDB();
});

describe('Topics gets APIFeatures', () => {
    describe('GET /topics?topic[regex]', () => {
        test('successful', testTopicSearch('limpieza'));
        test('successful', testTopicSearch('cuidado ambiental'));
        test('successful', testTopicSearch(''));   
    });
})


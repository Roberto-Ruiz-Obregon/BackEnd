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
    await dropCollections();
    await dropDB();
});

describe('User sign up', () => {
    describe('Successful user sign up /v1/user/auth/signup', () => {
        test('successful', async () => {
            const res = await agent.post('/v1/user/auth/signup').send({
                name: 'Dummy User',
                age: 12,
                gender: 'Mujer',
                job: 'Estudiante',
                educationLevel: 'Secundaria',
                postalCode: 76060,
                email: 'dummy_user@gmail.com',
                password: 'contra123',
                passwordConfirm: 'contra123',
            });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toBeTruthy();
            expect(res.body.data.user.email).toEqual('dummy_user@gmail.com');
        });
    });
    describe('Successful user login /v1/user/auth/login', () => {
        test('successful', async () => {
            const res = await agent.post('/v1/user/auth/login').send({
                email: 'dummy_user@gmail.com',
                password: 'contra123',
            });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toBeTruthy();
            expect(res.body.data.user.email).toEqual('dummy_user@gmail.com');
        });
    });
    describe('Error at user login /v1/user/auth/login', () => {
        test('successful', async () => {
            const res = await agent.post('/v1/user/auth/login').send({
                email: 'dummy_user@gmail.com',
                password: 'contra1234',
            });

            expect(res.statusCode).toEqual(401);
        });
    });
    describe('Error at user signup /v1/user/auth/signup', () => {
        test('successful', async () => {
            const res = await agent.post('/v1/user/auth/signup').send({
                name: 'Dummy User',
                age: 12,
                gender: 'Mujer',
                job: 'Estudiante',
                educationLevel: 'Secundaria',
                postalCode: 76060,
                email: 'dummy_user@gmail.com',
                password: 'contra123',
                passwordConfirm: 'contra123',
            });

            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toEqual(
                'Valor duplicado: "dummy_user@gmail.com". Por favor use otro valor.'
            );
        });
    });
});

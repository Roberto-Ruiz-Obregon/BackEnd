const request = require('supertest');
const app = require('../../app');
const {
    connectDB,
    dropDB,
    dropCollections,
} = require('../config/databaseTest');
const Admin = require('../../models/admins.model');

const agent = request.agent(app);

beforeAll(async () => {
    await connectDB();
});

afterAll(async () => {
    await dropCollections();
    await dropDB();
});

describe('Admin sign up', () => {
    describe('Successful admin sign up /v1/admin/auth/signup', () => {
        test('successful', async () => {
            const res = await agent.post('/v1/admin/auth/signup').send({
                name: 'Dummy Admin',
                email: 'dummy_admin@gmail.com',
                password: 'contra123',
                passwordConfirm: 'contra123',
            });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toBeTruthy();
        });
    });
    describe('Error at admin login due to lack of verification/v1/admin/auth/login', () => {
        test('successful', async () => {
            const res = await agent.post('/v1/admin/auth/login').send({
                email: 'dummy_admin@gmail.com',
                password: 'contra123',
            });
            expect(res.statusCode).toEqual(401);
            expect(res.body).toBeTruthy();
            expect(res.body.message).toEqual(
                'No haz sido verificado, espera a que un administrador verifique tu perfil.'
            );
        });
    });
    describe('Successful admin login /v1/admin/auth/login', () => {
        test('successful', async () => {
            await Admin.updateMany(
                { email: 'dummy_admin@gmail.com' },
                { hasVerification: true }
            );
            const res = await agent.post('/v1/admin/auth/login').send({
                email: 'dummy_admin@gmail.com',
                password: 'contra123',
            });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toBeTruthy();
            expect(res.body.data.user.email).toEqual('dummy_admin@gmail.com');
        });
    });
    describe('Error at admin login due to incorrect password /v1/admin/auth/login', () => {
        test('successful', async () => {
            const res = await agent.post('/v1/admin/auth/login').send({
                email: 'dummy_admin@gmail.com',
                password: 'contra1234',
            });

            expect(res.statusCode).toEqual(401);
            expect(res.body).toBeTruthy();
            expect(res.body.message).toEqual('Email o contraseña incorrectos.');
        });
    });
    describe('Error at admin signup /v1/admin/auth/signup', () => {
        test('successful', async () => {
            const res = await agent.post('/v1/admin/auth/signup').send({
                name: 'Dummy Admin',
                email: 'dummy_admin@gmail.com',
                password: 'contra123',
                passwordConfirm: 'contra123',
            });

            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toEqual(
                'Valor duplicado: "dummy_admin@gmail.com". Por favor use otro valor.'
            );
        });
    });
});

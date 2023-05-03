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
    // Da acceso a las rutas protegidas y restringidas
    await loginAdmin(agent, 'dummy_admin@gmail.com', 'contra123');
});

afterAll(async () => {
    await dropCollections();
    await dropDB();
});

describe('Program post', () => {
    describe('Successful POST /v1/program', () => {
        test('successful', async () => {
            const res = await agent.post('/v1/program').send({
                programName: 'Pruebas de backend',
                description: 'esto es una prueba de testing',
                category: 'Beca',
                imageUrl:
                    'https://www.bbva.com/wp-content/uploads/2017/08/bbva-balon-futbol-2017-08-11.jpg',
                hasLimit: 'Con limite de inscripcion',
                limitDate: '2023-06-23',
            });
            expect(res.statusCode).toEqual(201);
            expect(res.body).toBeTruthy();
        });
    });
    describe('Error POST /v1/program due to missing programName', () => {
        test('successful', async () => {
            const res = await agent.post('/v1/program').send({
                description: 'esto es una prueba de testing',
                category: 'Beca',
                imageUrl:
                    'https://www.bbva.com/wp-content/uploads/2017/08/bbva-balon-futbol-2017-08-11.jpg',
                hasLimit: 'Sin limite de inscripcion',
                limitDate: null,
            });
            expect(res.statusCode).toEqual(400);
            expect(res.body).toBeTruthy();
        });
    });
    describe('Error POST /v1/program due to missing programCategory', () => {
        test('successful', async () => {
            const res = await agent.post('/v1/program').send({
                programName: 'Pruebas de backend',
                description: 'esto es una prueba de testing',
                imageUrl:
                    'https://www.bbva.com/wp-content/uploads/2017/08/bbva-balon-futbol-2017-08-11.jpg',
                hasLimit: 'Sin limite de inscripcion',
                limitDate: null,
            });
            expect(res.statusCode).toEqual(400);
            expect(res.body).toBeTruthy();
        });
    });
    describe('Error POST /v1/program due to missing programImageURL', () => {
        test('successful', async () => {
            const res = await agent.post('/v1/program').send({
                programName: 'Pruebas de backend',
                imageUrl:
                    'https://www.bbva.com/wp-content/uploads/2017/08/bbva-balon-futbol-2017-08-11.jpg',
                description: 'esto es una prueba de testing',
                hasLimit: 'Sin limite de inscripcion',
                limitDate: null,
            });
            expect(res.statusCode).toEqual(400);
            expect(res.body).toBeTruthy();
        });
    });
    describe('Error POST /v1/program due to missing programHasLimit', () => {
        test('successful', async () => {
            const res = await agent.post('/v1/program').send({
                programName: 'Pruebas de backend',
                description: 'esto es una prueba de testing',
                category: 'Beca',
                imageUrl:
                    'https://www.bbva.com/wp-content/uploads/2017/08/bbva-balon-futbol-2017-08-11.jpg',
                limitDate: null,
            });
            expect(res.statusCode).toEqual(400);
            expect(res.body).toBeTruthy();
        });
    });
});

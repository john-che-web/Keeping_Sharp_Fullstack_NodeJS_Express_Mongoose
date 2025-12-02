const request = require('supertest');
const expressApp = require('../server'); // your express app

let token;
let taskId;

describe('Tasks API', () => {

    // 1️⃣ Register and login a user before running task tests
    beforeAll(async () => {
        // Register a test user
        await request(expressApp)
            .post('/users/register')
            .send({
                firstName: 'Task',
                lastName: 'Tester',
                email: 'tasktester@example.com',
                password: 'password123'
            });

        // Login to get token
        const loginRes = await request(expressApp)
            .post('/users/login')
            .send({
                email: 'tasktester@example.com',
                password: 'password123'
            });

        token = loginRes.body.token;
        expect(token).toBeDefined(); // sanity check
    });

    // 2️⃣ Test adding a task without auth
    it('should fail to add task without auth', async () => {
        const res = await request(expressApp)
            .post('/tasks')
            .send({
                name: 'Sample Task',
                description: 'Task description'
            });
        expect(res.status).toBe(401);
    });

    // 3️⃣ Test adding a task with auth
    it('should add task with auth', async () => {
        const res = await request(expressApp)
            .post('/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Sample Task',
                description: 'Task description'
            });

        expect(res.status).toBe(201);
        expect(res.body.task.name).toBe('Sample Task');
        expect(res.body.task.description).toBe('Task description');
        expect(res.body.task.status).toBe('Pending');
        taskId = res.body.task._id; // save taskId for later tests
    });

    // 4️⃣ Test updating task description
    it('should update task description', async () => {
        const res = await request(expressApp)
            .patch(`/tasks/${taskId}/description`)
            .set('Authorization', `Bearer ${token}`)
            .send({ description: 'Updated description' });

        expect(res.status).toBe(200);
        expect(res.body.task.description).toBe('Updated description');
    });

    // 5️⃣ Test invalid status update
    it('should reject invalid status update', async () => {
        const res = await request(expressApp)
            .patch(`/tasks/${taskId}/status`)
            .set('Authorization', `Bearer ${token}`)
            .send({ status: 'InvalidStatus' });

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/invalid status/i);
    });

    // 6️⃣ Test valid status update
    it('should update task status to Complete', async () => {
        const res = await request(expressApp)
            .patch(`/tasks/${taskId}/status`)
            .set('Authorization', `Bearer ${token}`)
            .send({ status: 'Complete' });

        expect(res.status).toBe(200);
        expect(res.body.task.status).toBe('Complete');
    });

    // 7️⃣ Test soft delete
    it('should soft delete a task', async () => {
        const res = await request(expressApp)
            .delete(`/tasks/${taskId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.task.status).toBe('Deleted');
    });
});

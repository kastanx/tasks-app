import { getRepository } from 'typeorm';
import { createApp } from '../../../../src/createApp';
import { Task, TaskStatus } from '../../../../src/task/model/Task';
import request, { SuperTest, Test } from 'supertest';
import Container from 'typedi';
import { LoginService } from '../../../../src/login/service/LoginService';
import { User } from '../../../../src/user/model/User';

describe('TaskController', () => {
  let app: SuperTest<Test>;

  let user: User;
  let token: string;

  const invalidToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE2ODMwNjA4MjAsImV4cCI6MTY4MzA2NDQyMH0.TwyBILnFCHGh103pr0uMCHz2L1RKXw7tKicQtBxKHU';

  beforeAll(async () => {
    app = request(await createApp());
    user = getRepository(User).create({
      id: '705e1207-1a8a-46fc-8777-7fd3e348322f',
      email: 'test@test.com',
      name: 'test user',
      password: 'test pass',
    });
    const loginService = Container.get(LoginService);
    token = loginService.sign(user);
  });

  beforeEach(async () => {
    await getRepository(Task).delete({});
  });

  describe('GET /v1/tasks', () => {
    it('should return task by id', async () => {
      const task = await getRepository(Task).save({ text: 'user task', userId: user.id });

      const response = await app.get(`/v1/tasks/${task.id}`).set('authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(task).toEqual({
        ...response.body,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should return 401 if unauthenticated', async () => {
      const task = await getRepository(Task).save({ text: 'user task', userId: user.id });

      const response = await app.get(`/v1/tasks/${task.id}`).set('authorization', `Bearer ${invalidToken}`);

      expect(response.status).toBe(401);
    });

    it('should return 404 if task was not found', async () => {
      const response = await app
        .get(`/v1/tasks/a2c640f6-48ea-4bbe-bd3b-a52a62076881`)
        .set('authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });

    it('should return all tasks paginated', async () => {
      await getRepository(Task).save({ text: 'user task', userId: user.id });
      await getRepository(Task).save({ text: 'user task 2', userId: user.id });
      await getRepository(Task).save({ text: 'user task 3', userId: user.id });
      const params = new URLSearchParams({ limit: '1', offset: '1' });

      const response = await app.get(`/v1/tasks?${params}`).set('authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.totalCount).toBe(3);
      expect(response.body.tasks.length).toBe(1);
      expect(response.body.tasks[0].text).toBe('user task 2');
    });

    it('should return all tasks sorted by createdAt ASC', async () => {
      await getRepository(Task).save({ text: 'user task', userId: user.id });
      await getRepository(Task).save({ text: 'user task 2', userId: user.id });
      await getRepository(Task).save({ text: 'user task 3', userId: user.id });
      const params = new URLSearchParams({ sortBy: 'createdAt', sortOrder: 'ASC' });

      const response = await app.get(`/v1/tasks?${params}`).set('authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.totalCount).toBe(3);
      expect(response.body.tasks.length).toBe(3);
      expect(response.body.tasks[0].text).toBe('user task');
    });

    it('should return all tasks sorted by createdAt DESC', async () => {
      await getRepository(Task).save({ text: 'user task', userId: user.id });
      await getRepository(Task).save({ text: 'user task 2', userId: user.id });
      await getRepository(Task).save({ text: 'user task 3', userId: user.id });
      const params = new URLSearchParams({ sortBy: 'createdAt', sortOrder: 'DESC' });

      const response = await app.get(`/v1/tasks?${params}`).set('authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.totalCount).toBe(3);
      expect(response.body.tasks.length).toBe(3);
      expect(response.body.tasks[0].text).toBe('user task 3');
    });

    it('should return all tasks sorted by updatedAt ASC', async () => {
      await getRepository(Task).save({ text: 'user task', userId: user.id });
      await getRepository(Task).save({ text: 'user task 2', userId: user.id });
      await getRepository(Task).save({ text: 'user task 3', userId: user.id });
      const params = new URLSearchParams({ sortBy: 'updatedAt', sortOrder: 'ASC' });

      const response = await app.get(`/v1/tasks?${params}`).set('authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.totalCount).toBe(3);
      expect(response.body.tasks.length).toBe(3);
      expect(response.body.tasks[0].text).toBe('user task');
    });

    it('should return all tasks sorted by updatedAt DESC', async () => {
      await getRepository(Task).save({ text: 'user task', userId: user.id });
      await getRepository(Task).save({ text: 'user task 2', userId: user.id });
      await getRepository(Task).save({ text: 'user task 3', userId: user.id });
      const params = new URLSearchParams({ sortBy: 'updatedAt', sortOrder: 'DESC' });

      const response = await app.get(`/v1/tasks?${params}`).set('authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.totalCount).toBe(3);
      expect(response.body.tasks.length).toBe(3);
      expect(response.body.tasks[0].text).toBe('user task 3');
    });

    it('should return all tasks for a user', async () => {
      await getRepository(Task).save({ text: 'user task', userId: user.id });
      await getRepository(Task).save({ text: 'random task', userId: 'b01d8f3d-7d53-4285-a883-ba7a5e33c8bc' });

      const response = await app.get('/v1/tasks').set('authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.totalCount).toBe(1);
      expect(response.body.tasks.length).toBe(1);
      expect(response.body.tasks[0].text).toBe('user task');
    });
  });

  describe('POST /v1/tasks', () => {
    it('should create a new task', async () => {
      const taskData = { text: 'test task' };

      const response = await app.post('/v1/tasks').set('authorization', `Bearer ${token}`).send(taskData);

      const createdTask = await getRepository(Task).findOne(response.body.id);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        ...taskData,
        status: TaskStatus.Backlog,
        userId: user.id,
        id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });

      expect(createdTask).toEqual({
        ...response.body,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('PUT /v1/tasks/:id', () => {
    it('should update an existing task', async () => {
      const task = await getRepository(Task).save({ text: 'abc', userId: user.id });

      const updatedTaskData = { text: 'updated task', status: TaskStatus.InProgress };

      const response = await app
        .put(`/v1/tasks/${task.id}`)
        .set('authorization', `Bearer ${token}`)
        .send(updatedTaskData);

      const updatedTask = await getRepository(Task).findOne(task.id);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        ...updatedTaskData,
        userId: user.id,
        id: task.id,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });

      expect(updatedTask).toEqual({
        ...response.body,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should throw 400 when provided invalid status', async () => {
      const task = await getRepository(Task).save({ text: 'abc', userId: user.id });

      const updatedTaskData = { text: 'updated task', status: 'test status' };

      const response = await app
        .put(`/v1/tasks/${task.id}`)
        .set('authorization', `Bearer ${token}`)
        .send(updatedTaskData);

      const updatedTask = await getRepository(Task).findOne(task.id);

      expect(response.status).toBe(400);
      expect(updatedTask).toEqual(task);
    });
  });

  describe('DELETE /v1/tasks/:id', () => {
    it('should delete a task', async () => {
      const task = await getRepository(Task).save({ text: 'abc', userId: user.id });

      const response = await app.delete(`/v1/tasks/${task.id}`).set('authorization', `Bearer ${token}`);

      const tasks = await getRepository(Task).find();

      expect(tasks.length).toBe(0);
      expect(response.status).toBe(204);
    });
  });
});

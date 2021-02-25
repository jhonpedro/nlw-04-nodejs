import request from 'supertest'
import app from '../app'

import createConnection from '../database'

describe('Users', () => {
	beforeAll(async () => {
		require('../database/deleteTest.js')

		const connection = await createConnection()

		try {
			await connection.runMigrations()
		} catch (error) {}
	})

	it('Should be able to create a new user', async () => {
		const response = await request(app).post('/users').send({
			email: 'user@example.com',
			name: 'User example',
		})

		expect(response.status).toBe(201)
	})

	it('Should not be able to create a new user if email already registered', async () => {
		const response = await request(app).post('/users').send({
			email: 'user@example.com',
			name: 'User example',
		})

		expect(response.status).toBe(401)
	})
})

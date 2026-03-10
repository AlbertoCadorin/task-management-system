import request from 'supertest'
import { app } from './server'

describe('GET /', () => {
    it('returns API health message', async () => {
        const response = await request(app).get('/')

        expect(response.status).toBe(200)
        expect(response.body).toEqual({
            message: 'Task Management API funzionante! 🚀',
        })
    })
})

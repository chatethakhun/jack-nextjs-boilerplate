import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import logger from '@/lib/logger'




describe('Axios Instance', () => {
  let mock: MockAdapter
  let instance: any

  beforeEach(async () => {
    // Clear all mocks
    vi.clearAllMocks()
    
    // Reset modules to get fresh instance
    vi.resetModules()
    
    // Import instance after reset
    const module = await import('@/lib/api')
    instance = module.default
    
    // Create mock adapter
    mock = new MockAdapter(instance)
  })

  afterEach(() => {
    mock.restore()
  })

  describe('Configuration', () => {
    it('should have correct baseURL from environment variable', () => {
      expect(instance.defaults.baseURL).toBe(process.env.NEXT_PUBLIC_API_URL)
    })

    it('should have correct default headers', () => {
      expect(instance.defaults.headers['Content-Type']).toBe('application/json')
    })
  })

  describe('Request Interceptor', () => {
    // it('should add Authorization header when token exists', async () => {
    //   const mockToken = 'mock-token-123'


    //   mock.onGet('/test').reply((config) => {
    //     expect(config.headers?.Authorization).toBe(`Bearer ${mockToken}`)
    //     return [200, { success: true }]
    //   })

    //   await instance.get('/test')


    // })

    it('should not add Authorization header when token does not exist', async () => {


      mock.onGet('/test').reply((config) => {
        expect(config.headers?.Authorization).toBeUndefined()
        return [200, { success: true }]
      })

      await instance.get('/test')


    })
  })

  describe('API Requests', () => {


    it('should make GET request successfully', async () => {
      const mockData = { id: 1, name: 'Test' }
      mock.onGet('/users/1').reply(200, mockData)

      const response = await instance.get('/users/1')

      expect(response.status).toBe(200)
      expect(response.data).toEqual(mockData)
    })

    it('should make POST request successfully', async () => {
      const postData = { name: 'New User' }
      const mockResponse = { id: 1, ...postData }
      
      mock.onPost('/users').reply(201, mockResponse)

      const response = await instance.post('/users', postData)

      expect(response.status).toBe(201)
      expect(response.data).toEqual(mockResponse)
    })

    it('should make PUT request successfully', async () => {
      const putData = { name: 'Updated User' }
      const mockResponse = { id: 1, ...putData }
      
      mock.onPut('/users/1').reply(200, mockResponse)

      const response = await instance.put('/users/1', putData)

      expect(response.status).toBe(200)
      expect(response.data).toEqual(mockResponse)
    })

    it('should make DELETE request successfully', async () => {
      mock.onDelete('/users/1').reply(204)

      const response = await instance.delete('/users/1')

      expect(response.status).toBe(204)
    })

    it('should handle 401 error', async () => {
      mock.onGet('/protected').reply(401, { message: 'Unauthorized' })

      await expect(instance.get('/protected')).rejects.toMatchObject({
        response: {
          status: 401,
          data: { message: 'Unauthorized' }
        }
      })
    })

    it('should handle 404 error', async () => {
      mock.onGet('/not-found').reply(404, { message: 'Not Found' })

      await expect(instance.get('/not-found')).rejects.toMatchObject({
        response: {
          status: 404,
          data: { message: 'Not Found' }
        }
      })
    })

    it('should handle 500 error', async () => {
      mock.onGet('/server-error').reply(500, { message: 'Internal Server Error' })

      await expect(instance.get('/server-error')).rejects.toMatchObject({
        response: {
          status: 500,
          data: { message: 'Internal Server Error' }
        }
      })
    })

    it('should handle network error', async () => {
      mock.onGet('/network-error').networkError()

      await expect(instance.get('/network-error')).rejects.toThrow('Network Error')
    })
  })
})
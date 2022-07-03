import supertest from 'supertest'
import app from '../../../app'
import * as setJWTModules from '.'
import { Request, Response } from 'express'
import axios, { AxiosError } from 'axios'
import fs from 'fs'
import jwt from 'jsonwebtoken'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

const baseRoute = '/api/v1/jwt'
const { refreshJWTHandler: setJWTHandler } = setJWTModules

jest.spyOn(global.console, 'error').mockImplementation(() => {})
jest.spyOn(global.console, 'info').mockImplementation(() => {})

const responseTokens = {
  accToken: 'fakeJwt',
  refToken: 'fakeJwt',
}
const mockRedisResponse = () => mockedAxios.request.mockResolvedValueOnce({})

describe('Set JWT route', () => {
  const env = process.env

  jest
    .spyOn(fs, 'readFileSync')
    .mockImplementation(() => Buffer.from('fakePrivKey'))

  let request: supertest.SuperTest<supertest.Test>

  beforeAll(() => {
    request = supertest(app)
  })

  beforeEach(() => {
    jest.spyOn(jwt, 'sign').mockImplementation(() => 'fakeJwt')
    process.env = {
      ...env,
      REDIS_MANAGER_URL: 'REDIS_MANAGER_URL',
      REDIS_MANAGER_SET_HASH_ENDPOINT: 'REDIS_MANAGER_SET_HASH_ENDPOINT',
    }
  })

  afterEach(() => {
    jest.resetAllMocks()
    process.env = env
  })

  it('Should call method when root path', (done) => {
    jest.spyOn(setJWTModules, 'setJWTHandler')
    mockRedisResponse()

    request
      .post(`${baseRoute}/`)
      .send({
        email: 'fake@email.com',
      })
      .expect(200)
      .then(() => {
        expect(setJWTModules.refreshJWTHandler).toHaveBeenCalled()
        done()
      })
  })

  it('Should respond 200 when creates JWT', async () => {
    mockRedisResponse()

    const req = {
      body: {
        email: 'fake@email.com',
      },
    } as Request

    const res = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    } as any as Response

    const loginResponse = await setJWTHandler(req, res)
    expect(loginResponse.status).toBeCalledWith(200)
    expect(loginResponse.send).toBeCalledWith(responseTokens)
  })

  it('Should respond 500 if axios returns error', async () => {
    const errorMsg = 'Error message'
    mockedAxios.request.mockRejectedValueOnce(new Error(errorMsg) as AxiosError)

    const req = {
      body: {
        email: 'fake@email.com',
      },
    } as Request

    const res = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    } as any as Response

    const loginResponse = await setJWTHandler(req, res)
    expect(loginResponse.status).toBeCalledWith(500)
    expect(loginResponse.send).toBeCalledWith({
      message: errorMsg,
    })
  })
})

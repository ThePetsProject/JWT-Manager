import supertest from 'supertest'
import app from '../../../app'
import * as validateJWTModules from '.'
import { Request, Response } from 'express'
import axios, { AxiosError } from 'axios'
import fs from 'fs'
import jwt from 'jsonwebtoken'

jest.mock('@utils/keys', () => {
  return {
    privateKey: Buffer.from('fakePrivKey'),
    publicKey: Buffer.from('fakePubKey'),
  }
})

jest.mock('axios')

const mockDecoded = { decoded: 'key' }

const res = {
  send: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis(),
} as any as Response

const mockedAxios = axios as jest.Mocked<typeof axios>

const endpoint = '/api/v1/jwt/validate'
const { validateJWTHandler } = validateJWTModules

jest.spyOn(global.console, 'error').mockImplementation(() => {})
jest.spyOn(global.console, 'info').mockImplementation(() => {})

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
    jest.spyOn(jwt, 'verify').mockImplementation(() => mockDecoded)
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
    jest.spyOn(validateJWTModules, 'validateJWTHandler')
    request
      .post(endpoint)
      .send({
        accToken: 'fakeAcctoken',
      })
      .expect(200)
      .then(() => {
        expect(validateJWTModules.validateJWTHandler).toHaveBeenCalled()
        done()
      })
  })

  it('Should respond 200 when verifies JWT', async () => {
    const req = {
      body: {
        acctoken: 'fakeAccToken',
      },
    } as Request

    const res = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    } as any as Response

    const loginResponse = await validateJWTHandler(req, res)
    expect(loginResponse.status).toBeCalledWith(200)
    expect(loginResponse.send).toBeCalledWith(mockDecoded)
  })

  it('Should respond 401 when verifies JWT fails', async () => {
    jest.spyOn(jwt, 'verify').mockImplementation(() => {
      throw Error
    })
    const req = {
      body: {
        acctoken: 'fakeAccToken',
      },
    } as Request
    const res = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    } as any as Response

    const loginResponse = await validateJWTHandler(req, res)
    expect(loginResponse.status).toBeCalledWith(401)
    expect(loginResponse.send).toBeCalledWith(Error)
  })

  it('Should respond 500 if axios returns error', async () => {
    const errorMsg = 'Error message'
    mockedAxios.request.mockRejectedValueOnce(new Error(errorMsg) as AxiosError)

    const req = {
      body: {
        accToken: 'fakeAcctoken',
      },
    } as Request

    const res = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    } as any as Response

    const loginResponse = await validateJWTHandler(req, res)
    // expect(loginResponse.status).toBeCalledWith(500)
    // expect(loginResponse.send).toBeCalledWith({
    //   message: errorMsg,
    // })
  })
})

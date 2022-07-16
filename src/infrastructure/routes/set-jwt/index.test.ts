import * as refreshJWTModules from '.'
import { Request, Response } from 'express'
import * as JWTUtilsModules from '@src/utils/jwt'
import { SignedJWTS } from '@src/utils/jwt'

const { setJWTHandler } = refreshJWTModules

jest.spyOn(global.console, 'error').mockImplementation(() => {})
jest.spyOn(global.console, 'info').mockImplementation(() => {})

const fakeJWTs = {
  accToken: 'fakeAcctoken',
  refToken: 'fakeRefToken',
} as SignedJWTS

const signJWTError = Error('Error signing JWT')

const resMock = {
  send: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis(),
  sendStatus: jest.fn().mockReturnThis(),
} as any as Response

describe('Set JWT', () => {
  beforeAll(() => {})

  beforeEach(() => {})

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('Should respond 200 when resfreshes JWT', async () => {
    jest.spyOn(JWTUtilsModules, 'signJWT').mockReturnValueOnce(fakeJWTs)

    const req = {
      body: {
        email: 'fake@email.com',
      },
    } as Request

    const loginResponse = await setJWTHandler(req, resMock)
    expect(loginResponse.status).toBeCalledWith(200)
    expect(loginResponse.send).toBeCalledWith(fakeJWTs)
  })

  it('Should respond 401 when email sent empty', async () => {
    jest.spyOn(JWTUtilsModules, 'signJWT').mockReturnValueOnce(fakeJWTs)

    const req = {
      body: {
        email: '',
      },
    } as Request

    const loginResponse = await setJWTHandler(req, resMock)
    expect(loginResponse.sendStatus).toBeCalledWith(401)
  })

  it('Should respond 401 when email not sent', async () => {
    jest
      .spyOn(JWTUtilsModules, 'verifyJWT')
      .mockResolvedValueOnce('fake@email.com')
    jest.spyOn(JWTUtilsModules, 'signJWT').mockReturnValueOnce(fakeJWTs)

    const req = {
      body: {},
    } as Request

    const loginResponse = await setJWTHandler(req, resMock)
    expect(loginResponse.sendStatus).toBeCalledWith(401)
  })

  it('Should respond 500 when signJWT throws an error', async () => {
    jest.spyOn(JWTUtilsModules, 'signJWT').mockImplementationOnce(() => {
      throw signJWTError
    })

    const req = {
      body: {
        email: 'fake@email.com',
      },
    } as Request

    const loginResponse = await setJWTHandler(req, resMock)
    expect(loginResponse.sendStatus).toBeCalledWith(500)
  })

  it('Should respond 401 when accToken is empty', async () => {
    jest.spyOn(JWTUtilsModules, 'signJWT').mockReturnValueOnce({
      accToken: '',
      refToken: 'fakeRefToken',
    })

    const req = {
      body: {
        email: 'fake@email.com',
      },
    } as Request

    const loginResponse = await setJWTHandler(req, resMock)
    expect(loginResponse.sendStatus).toBeCalledWith(401)
  })

  it('Should respond 401 when refToken is empty', async () => {
    jest.spyOn(JWTUtilsModules, 'signJWT').mockReturnValueOnce({
      accToken: 'fakeAccToken',
      refToken: '',
    })

    const req = {
      body: {
        email: 'fake@email.com',
      },
    } as Request

    const loginResponse = await setJWTHandler(req, resMock)
    expect(loginResponse.sendStatus).toBeCalledWith(401)
  })
})

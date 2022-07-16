import * as refreshJWTModules from '.'
import { Request, Response } from 'express'
import * as JWTUtilsModules from '@src/utils/jwt'
import { SignedJWTS } from '@src/utils/jwt'

const { refreshJWTHandler } = refreshJWTModules

jest.spyOn(global.console, 'error').mockImplementation(() => {})
jest.spyOn(global.console, 'info').mockImplementation(() => {})

const fakeJWTs = {
  accToken: 'fakeAcctoken',
  refToken: 'fakeRefToken',
} as SignedJWTS

const verifyJWTError = Error('Error verifying JWT')

const resMock = {
  send: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis(),
  sendStatus: jest.fn().mockReturnThis(),
} as any as Response

describe('Refresh JWT', () => {
  beforeAll(() => {})

  beforeEach(() => {})

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('Should respond 200 when resfreshes JWT', async () => {
    jest
      .spyOn(JWTUtilsModules, 'verifyJWT')
      .mockResolvedValueOnce('fake@email.com')
    jest.spyOn(JWTUtilsModules, 'signJWT').mockReturnValueOnce(fakeJWTs)

    const req = {
      body: {
        token: 'fakeToken',
      },
    } as Request

    const loginResponse = await refreshJWTHandler(req, resMock)
    expect(loginResponse.status).toBeCalledWith(200)
    expect(loginResponse.send).toBeCalledWith(fakeJWTs)
  })

  it('Should respond 401 when token sent empty', async () => {
    jest
      .spyOn(JWTUtilsModules, 'verifyJWT')
      .mockResolvedValueOnce('fake@email.com')
    jest.spyOn(JWTUtilsModules, 'signJWT').mockReturnValueOnce(fakeJWTs)

    const req = {
      body: {
        token: '',
      },
    } as Request

    const loginResponse = await refreshJWTHandler(req, resMock)
    expect(loginResponse.sendStatus).toBeCalledWith(401)
  })

  it('Should respond 401 when token not sent', async () => {
    jest
      .spyOn(JWTUtilsModules, 'verifyJWT')
      .mockResolvedValueOnce('fake@email.com')
    jest.spyOn(JWTUtilsModules, 'signJWT').mockReturnValueOnce(fakeJWTs)

    const req = {
      body: {},
    } as Request

    const loginResponse = await refreshJWTHandler(req, resMock)
    expect(loginResponse.sendStatus).toBeCalledWith(401)
  })

  it('Should respond 401 when verifyToken throws an error', async () => {
    jest.spyOn(JWTUtilsModules, 'verifyJWT').mockRejectedValue(verifyJWTError)
    jest.spyOn(JWTUtilsModules, 'signJWT').mockReturnValueOnce(fakeJWTs)

    const req = {
      body: {
        token: 'fakeToken',
      },
    } as Request

    const loginResponse = await refreshJWTHandler(req, resMock)
    expect(loginResponse.status).toBeCalledWith(401)
    expect(loginResponse.send).toBeCalledWith(verifyJWTError)
  })

  it('Should respond 500 when verifyToken return value is empty', async () => {
    jest.spyOn(JWTUtilsModules, 'verifyJWT').mockResolvedValue('')
    jest.spyOn(JWTUtilsModules, 'signJWT').mockReturnValueOnce(fakeJWTs)

    const req = {
      body: {
        token: 'fakeToken',
      },
    } as Request

    const loginResponse = await refreshJWTHandler(req, resMock)
    expect(loginResponse.sendStatus).toBeCalledWith(500)
  })

  it('Should respond 401 when accToken is empty', async () => {
    jest.spyOn(JWTUtilsModules, 'verifyJWT').mockResolvedValue('fake@email.com')
    jest.spyOn(JWTUtilsModules, 'signJWT').mockReturnValueOnce({
      accToken: '',
      refToken: 'fakeRefToken',
    })

    const req = {
      body: {
        token: 'fakeToken',
      },
    } as Request

    const loginResponse = await refreshJWTHandler(req, resMock)
    expect(loginResponse.sendStatus).toBeCalledWith(401)
  })

  it('Should respond 401 when refToken is empty', async () => {
    jest.spyOn(JWTUtilsModules, 'verifyJWT').mockResolvedValue('fake@email.com')
    jest.spyOn(JWTUtilsModules, 'signJWT').mockReturnValueOnce({
      accToken: 'fakeAccToken',
      refToken: '',
    })

    const req = {
      body: {
        token: 'fakeToken',
      },
    } as Request

    const loginResponse = await refreshJWTHandler(req, resMock)
    expect(loginResponse.sendStatus).toBeCalledWith(401)
  })
})

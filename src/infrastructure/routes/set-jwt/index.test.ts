import supertest from 'supertest'
import app from '../../../app'
import * as loginModules from '.'
import { Request, Response } from 'express'

const baseRoute = '/api/v1/jwt/set-hash'
const { setJWTHandler: loginHandler } = loginModules

describe('Set hash route', () => {
  let request: supertest.SuperTest<supertest.Test>

  beforeAll(() => {
    request = supertest(app)
  })

  beforeEach(() => {})

  afterEach(() => {
    jest.resetAllMocks()
  })
  it('Completemeplease', () => {})
})

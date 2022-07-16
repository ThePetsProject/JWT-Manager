import { SignedJWTS, signJWT, verifyJWT } from './jwt'
import jwt from 'jsonwebtoken'
import fs from 'fs'

const email = 'fake@email.com'
process.env.TOKEN_EXPIRE = '2 days'
process.env.REF_TOKEN_EXPIRE = '7 days'

describe('JWT utils', () => {
  describe('Sign JWT', () => {
    it('Should return accToken and refToken', () => {
      jest.spyOn(jwt, 'sign').mockImplementation(() => 'fakeJwt')

      jest
        .spyOn(fs, 'readFileSync')
        .mockImplementation(() => Buffer.from('fakePrivKey'))

      const expectedResponse = {
        accToken: 'fakeJwt',
        refToken: 'fakeJwt',
      } as SignedJWTS

      const signResponse = signJWT(email)
      expect(signResponse).toEqual(expectedResponse)
    })

    it('Should throw error if sign fails', () => {
      const signError = Error('Error message')
      jest.spyOn(jwt, 'sign').mockImplementation(() => {
        throw signError
      })

      jest
        .spyOn(fs, 'readFileSync')
        .mockImplementation(() => Buffer.from('fakePrivKey'))

      const expectedResponse = {
        accToken: 'fakeJwt',
        refToken: 'fakeJwt',
      } as SignedJWTS

      expect(() => {
        signJWT(email)
      }).toThrow(Error)
    })
  })

  describe('Verify JWT', () => {
    it('Should return email from decoded JWT', async () => {
      const fakeEmail = 'fake@email.com'
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => ({
        email: fakeEmail,
      }))

      const fakeToken = 'fakeToken'

      const verifyResponse = await verifyJWT(fakeToken)
      expect(verifyResponse).toBe(fakeEmail)
    })
    it('Should return empty string from decoded JWT if email could not be retrieved', async () => {
      const fakeEmail = undefined
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => ({
        email: fakeEmail,
      }))

      const fakeToken = 'fakeToken'

      const verifyResponse = await verifyJWT(fakeToken)
      expect(verifyResponse).toBe('')
    })

    it('Should throw error if verify is error', async () => {
      const verifyError = Error('Error message')
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw verifyError
      })

      const fakeToken = 'fakeToken'
      await expect(verifyJWT(fakeToken)).rejects.toThrow(Error)
    })
  })
})

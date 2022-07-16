import jwt, { SignOptions } from 'jsonwebtoken'
import { privateKey, publicKey } from './keys'

interface DecodedReftoken extends jwt.JwtPayload {
  email: string
}

export interface SignedJWTS {
  accToken: string
  refToken: string
}

export type SignedJWTSType = SignedJWTS

export const tokenSignConfig: SignOptions = {
  algorithm: 'RS256',
  expiresIn: process.env.TOKEN_EXPIRE,
}
export const refTokenSignConfig: SignOptions = {
  algorithm: 'RS256',
  expiresIn: process.env.REF_TOKEN_EXPIRE,
}

export const signJWT = (email: string): SignedJWTS => {
  try {
    const accToken = jwt.sign({ email }, privateKey, tokenSignConfig)
    const refToken = jwt.sign({ email }, privateKey, refTokenSignConfig)

    return {
      accToken,
      refToken,
    }
  } catch (error) {
    throw error
  }
}

export const verifyJWT = async (token: string): Promise<string> => {
  try {
    const decoded = await jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
    })
    return (decoded as DecodedReftoken).email || ''
  } catch (error) {
    throw error
  }
}

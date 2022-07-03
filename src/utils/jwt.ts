import { SignOptions } from 'jsonwebtoken'

export const tokenSignConfig: SignOptions = {
  algorithm: 'RS256',
  expiresIn: process.env.TOKEN_EXPIRE,
}
export const refTokenSignConfig: SignOptions = {
  algorithm: 'RS256',
  expiresIn: process.env.REF_TOKEN_EXPIRE,
}

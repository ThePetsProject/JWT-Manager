import { AxiosRequestConfig } from 'axios'
import { Response } from 'express'
import jwt from 'jsonwebtoken'
import { tokenSignConfig, refTokenSignConfig } from './jwt'
import { privateKey, publicKey } from './keys'

interface DecodedReftoken extends jwt.JwtPayload {
  email: string
}

export const redisUrl = `${process.env.REDIS_MANAGER_URL}/${process.env.REDIS_MANAGER_SET_HASH_ENDPOINT}`

export const redisAxiosConfig = (
  accToken: string,
  refToken: string,
  email: string
) =>
  ({
    method: 'post',
    url: redisUrl,
    data: {
      accToken,
      refToken,
      email,
    },
  } as AxiosRequestConfig)

export const signJWT = (email: string, res: Response): Response => {
  try {
    const accToken = jwt.sign({ email }, privateKey, tokenSignConfig)
    const refToken = jwt.sign({ email }, privateKey, refTokenSignConfig)

    return res.status(200).send({
      accToken,
      refToken,
    })
  } catch (error) {
    return res.status(500).send(error)
  }
}

export const verifyJWT = async (token: string): Promise<string> => {
  try {
    const decoded = await jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
    })
    return (decoded as DecodedReftoken).email
  } catch (error) {
    throw error
  }
}

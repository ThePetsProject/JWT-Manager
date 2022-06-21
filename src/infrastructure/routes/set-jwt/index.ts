import { Router } from 'express'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import Joi from 'joi'
import fs from 'fs'
import axios, { AxiosError } from 'axios'

export type SetJWTRouteFnType = (router: Router) => Router

export const setJWTHandler = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { email } = req.body
  const vaultSecretsPath = process.env.VAULT_SECRET_FILE_PATH

  const privateKey = fs.readFileSync(`${vaultSecretsPath}pk.pem`)
  const accToken = jwt.sign({ email }, privateKey, {
    algorithm: 'RS256',
    expiresIn: 120,
  })
  const refToken = jwt.sign({ email }, privateKey, {
    algorithm: 'RS256',
    expiresIn: '7 days',
  })

  const redisUrl = `${process.env.REDIS_MANAGER_URL}/${process.env.REDIS_MANAGER_SET_HASH_ENDPOINT}`
  console.log(redisUrl)

  const axiosConfig = {
    method: 'post',
    url: redisUrl,
    data: {
      accToken,
      refToken,
      email,
    },
  }
  return axios
    .request(axiosConfig)
    .then(() => {
      return res.status(200).send({
        accToken,
        refToken,
      })
    })
    .catch((error: AxiosError) => {
      console.error(`[JWT-MANAGER][ERROR][ERROR_MESSAGE] ${error.message}`)
      console.error(`[JWT-MANAGER][ERROR][ERROR_CODE] ${error.code}`)
      return res.status(500).send({
        message: error.message,
      })
    })
}

export const setJWTRoute: SetJWTRouteFnType = (router: Router): Router => {
  return router.post('/', (req, res) => setJWTHandler(req, res))
}

import { Router } from 'express'
import { Request, Response } from 'express'
import Joi from 'joi'
import md5 from 'md5'
import { redisConnect } from '@src/infrastructure/database/connect'

export type SetHashRouteFnType = (router: Router) => Router

export const setHashHandler = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { email } = req.body

  const emailHash = md5(email)

  const redisClient = await redisConnect()

  await redisClient.connect()
  await redisClient.hSet(emailHash, 'acc_token', '123123123')
  redisClient.quit()

  return res.status(200).send()
}

export const setHashRoute: SetHashRouteFnType = (router: Router): Router => {
  return router.post('/set-hash', (req, res) => setHashHandler(req, res))
}

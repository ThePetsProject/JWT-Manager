import { Router } from 'express'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { tokenSignConfig, refTokenSignConfig } from '@src/utils/jwt'
import { privateKey } from '@src/utils/keys'
import { signJWT } from '@src/utils/redis'

export type SetJWTRouteFnType = (router: Router) => Router

export const setJWTHandler = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { email } = req.body

  return signJWT(email, res)
}

export const setJWTRoute: SetJWTRouteFnType = (router: Router): Router => {
  return router.post('/', (req, res) => setJWTHandler(req, res))
}

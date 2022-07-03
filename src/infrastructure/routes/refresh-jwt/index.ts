import { Router } from 'express'
import { Request, Response } from 'express'
import { signJWT, verifyJWT } from '@src/utils/redis'

export type SetJWTRouteFnType = (router: Router) => Router

export const refreshJWTHandler = async (
  req: Request,
  res: Response
): Promise<Response> => {
  let email = ''
  const { token } = req.body

  try {
    email = await verifyJWT(token)
  } catch (error) {
    return res.status(401).send(error)
  }

  if (!(email.length || email)) return res.status(500).send()

  return signJWT(email, res)
}

export const refreshJWTRoute: SetJWTRouteFnType = (router: Router): Router => {
  return router.post('/refresh', (req, res) => refreshJWTHandler(req, res))
}

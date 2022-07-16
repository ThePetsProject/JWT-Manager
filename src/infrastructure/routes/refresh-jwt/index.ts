import { Router } from 'express'
import { Request, Response } from 'express'
import { signJWT, verifyJWT } from '@src/utils/jwt'

export type SetJWTRouteFnType = (router: Router) => Router

export const refreshJWTHandler = async (
  req: Request,
  res: Response
): Promise<Response> => {
  let email = ''
  const { token } = req.body

  if (!token?.length) return res.sendStatus(401)

  try {
    email = await verifyJWT(token)
  } catch (error) {
    return res.status(401).send(error)
  }

  if (!email.length) return res.sendStatus(500)

  const { accToken, refToken } = signJWT(email)

  if (!(accToken.length && refToken.length)) return res.sendStatus(401)

  return res.status(200).send({
    accToken,
    refToken,
  })
}

export const refreshJWTRoute: SetJWTRouteFnType = (router: Router): Router => {
  return router.post('/refresh', (req, res) => refreshJWTHandler(req, res))
}

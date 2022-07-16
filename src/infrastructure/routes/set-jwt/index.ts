import { Router } from 'express'
import { Request, Response } from 'express'
import { signJWT } from '@src/utils/jwt'

export type SetJWTRouteFnType = (router: Router) => Router

export const setJWTHandler = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { email } = req.body

  if (!email?.length) return res.sendStatus(401)

  try {
    const { accToken, refToken } = signJWT(email)

    if (!(accToken.length && refToken.length)) return res.sendStatus(401)

    return res.status(200).send({
      accToken,
      refToken,
    })
  } catch (error) {
    return res.sendStatus(500)
  }
}

export const setJWTRoute: SetJWTRouteFnType = (router: Router): Router => {
  return router.post('/', (req, res) => setJWTHandler(req, res))
}

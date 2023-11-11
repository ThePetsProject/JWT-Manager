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

/**
 * @swagger
 * /api/v1/jwt:
 *  post:
 *    summary: Set JWT
 *    description: Set JWT tokens
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                example: mail@email.com
 *                description: Email to be used in JWT
 *    responses:
 *      200:
 *        description: JWT tokens are valid
 *        content:
 *          application/json:
 *            example:
 *              accToken: eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwiaWF0IjoxNjI5MjU0NjQ2LCJleHAiOjE2Mjk4NTk0ND
 *              refToken: eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwiaWF0IjoxNjI5MjU0NjQ2LCJleHAiOjE2Mjk4NTk0ND
 *      401:
 *        description: Invalid JWT tokens
 *        content:
 *          application/json:
 *            example:
 *              message: Invalid token
 */
export const setJWTRoute: SetJWTRouteFnType = (router: Router): Router => {
  return router.post('/', (req, res) => setJWTHandler(req, res))
}

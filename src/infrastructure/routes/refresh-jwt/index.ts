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

/**
 * @swagger
 * /api/v1/jwt/refresh:
 *   post:
 *     summary: Refresh JWT
 *     description: Refresh JWT tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 example: eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwiaWF0IjoxNjI5MjU0NjQ2LCJleHAiOjE2Mjk4NTk0ND
 *     responses:
 *       200:
 *         description: JWT tokens are valid
 *         content:
 *           application/json:
 *             example:
 *               accToken: eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwiaWF0IjoxNjI5MjU0NjQ2LCJleHAiOjE2Mjk4NTk0ND
 *               refToken: eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwiaWF0IjoxNjI5MjU0NjQ2LCJleHAiOjE2Mjk4NTk0ND
 *       401:
 *         description: Invalid JWT tokens
 *         content:
 *           application/json:
 *             example:
 *               message: Invalid token
 */

export const refreshJWTRoute: SetJWTRouteFnType = (router: Router): Router => {
  return router.post('/refresh', (req, res) => refreshJWTHandler(req, res))
}

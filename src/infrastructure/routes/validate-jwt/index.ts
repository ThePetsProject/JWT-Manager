import { Router } from 'express'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import fs from 'fs'

export type ValidateJWTRouteFnType = (router: Router) => Router

export const validateJWTHandler = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { token } = req.body
  const vaultSecretsPath = process.env.VAULT_SECRETS_FILE_PATH

  const publicKey = fs.readFileSync(`${vaultSecretsPath}pubk.pem`)

  try {
    const decoded = await jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
    })
    return res.status(200).send(decoded)
  } catch (error) {
    return res.status(401).send(error)
  }
}

export const validateJWTRoute: ValidateJWTRouteFnType = (
  router: Router
): Router => {
  // Make Swagger annotations
  /**
   * @swagger
   * /api/v1/jwt/validate:
   *   post:
   *     summary: Validate JWT token
   *     description: Validate a JWT token using public key
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               token:
   *                 type: string
   *                 description: JWT token to be validated
   *     responses:
   *       200:
   *         description: JWT token is valid
   *         content:
   *           application/json:
   *             example:
   *               message: Token is valid
   *       401:
   *         description: Invalid JWT token
   *         content:
   *           application/json:
   *             example:
   *               message: Invalid token
   */
  return router.post('/validate', (req, res) => validateJWTHandler(req, res))
}

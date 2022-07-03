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
  const vaultSecretsPath = process.env.VAULT_SECRET_FILE_PATH

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
  return router.post('/validate', (req, res) => validateJWTHandler(req, res))
}

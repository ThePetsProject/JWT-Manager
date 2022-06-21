import { Router } from 'express'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import Joi from 'joi'
import fs from 'fs'

export type ValidateJWTRouteFnType = (router: Router) => Router

export const validateJWTHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { accToken, refToken } = req.body
  const vaultSecretsPath = process.env.VAULT_SECRET_FILE_PATH

  const publicKey = fs.readFileSync(`${vaultSecretsPath}pubk.pem`)

  return jwt.verify(
    accToken,
    publicKey,
    {
      algorithms: ['RS256'],
    },
    (err, decoded) => {
      return err ? res.status(401).send(err) : res.status(200).send(decoded)
    }
  )
}

export const validateJWTRoute: ValidateJWTRouteFnType = (
  router: Router
): Router => {
  return router.post('/validate', (req, res) => validateJWTHandler(req, res))
}

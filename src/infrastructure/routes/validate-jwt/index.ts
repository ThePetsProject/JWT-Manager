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
   *                 example: eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1haWxAZW1haWwuY29tIiwiaWF0IjoxNjk5NzM5MjM1LCJleHAiOjI1NjM2NTI4MzV9.xQkR95Dun9-95Y0phTyqaLwYSYRPDYcmAvI1K3bUkY2WlFGkohJiKuEna0xEdgtwUzxCohFIbDYQIbaR_WM4tlBvGTFNlwkp10mKgnRGq8hRDoBIPirSjugso24Y67P7k8K2xW9wndziHE1hzREhUmPnRfH5VzlU7T5i6eekZZ9Rxdl_5BGlNnKNvdVyuDGb2KKrRZR-keiHprMaJNap-V-tR5yRyhDfjkad-78p-fGPqFfEhd4nERUDNgt2O5NfZIw-wwj_ya424Wg7QKmD4aXD-QAtbOzXw0Q9EMIgougW6SqyhqSZYoJATIW78tHsZR9AoaBD2cIYrzAA4fT8xQ
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

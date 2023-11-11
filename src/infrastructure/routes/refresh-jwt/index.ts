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
 *                 example: eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1haWxAZW1haWwuY29tIiwiaWF0IjoxNjk5NzM5MjM1LCJleHAiOjI1NjM3MzkyMzV9.PGGz5DnRHC3ibdTVYVsEwIUYlZYhDRq4aItGlsT3KQKtik7YS9SraLvhJppJtNO8-5VMrFM085fi6PBkz_2djVQ_Nfot9Zu_Zp7t4QTJv9ohK8yW-Waec4tbfOqzo-eEdcO0pWWflNUNvXtM6KN_mqTdzfEuz2NOAtz-4_-4zqF52_iK3WXW4zFjoMIhP9f8Y_e3XyO1PettM_OVhNMZZRUmSbYDX-s-kCN3JbHdptcmcDndzbOeayCKH7OVrLVmnjvE7gg8PTlgdfjLGAbvlvDX4LKulib-fo1mEELM8KNRAqyaztkHmdaJDOxGwIlUZYUifVUkHLmKSRZkQndYKA
 *     responses:
 *       200:
 *         description: JWT tokens are valid
 *         content:
 *           application/json:
 *             example:
 *               accToken: eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1haWxAZW1haWwuY29tIiwiaWF0IjoxNjk5NzM5MjM1LCJleHAiOjI1NjM2NTI4MzV9.xQkR95Dun9-95Y0phTyqaLwYSYRPDYcmAvI1K3bUkY2WlFGkohJiKuEna0xEdgtwUzxCohFIbDYQIbaR_WM4tlBvGTFNlwkp10mKgnRGq8hRDoBIPirSjugso24Y67P7k8K2xW9wndziHE1hzREhUmPnRfH5VzlU7T5i6eekZZ9Rxdl_5BGlNnKNvdVyuDGb2KKrRZR-keiHprMaJNap-V-tR5yRyhDfjkad-78p-fGPqFfEhd4nERUDNgt2O5NfZIw-wwj_ya424Wg7QKmD4aXD-QAtbOzXw0Q9EMIgougW6SqyhqSZYoJATIW78tHsZR9AoaBD2cIYrzAA4fT8xQ
 *               refToken: eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1haWxAZW1haWwuY29tIiwiaWF0IjoxNjk5NzM5MjM1LCJleHAiOjI1NjM3MzkyMzV9.PGGz5DnRHC3ibdTVYVsEwIUYlZYhDRq4aItGlsT3KQKtik7YS9SraLvhJppJtNO8-5VMrFM085fi6PBkz_2djVQ_Nfot9Zu_Zp7t4QTJv9ohK8yW-Waec4tbfOqzo-eEdcO0pWWflNUNvXtM6KN_mqTdzfEuz2NOAtz-4_-4zqF52_iK3WXW4zFjoMIhP9f8Y_e3XyO1PettM_OVhNMZZRUmSbYDX-s-kCN3JbHdptcmcDndzbOeayCKH7OVrLVmnjvE7gg8PTlgdfjLGAbvlvDX4LKulib-fo1mEELM8KNRAqyaztkHmdaJDOxGwIlUZYUifVUkHLmKSRZkQndYKA
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

import { Router } from 'express'
import { Response } from 'express'
import projectProperties from '@utils/project_properties'

export type HealthRouteFnType = (router: Router) => Router

export const formatTime = (seconds: number) => {
  const pad = (time: number) => (time < 10 ? '0' : '') + time
  const hours = Math.floor(seconds / (60 * 60))
  const minutes = Math.floor((seconds % (60 * 60)) / 60)
  seconds = Math.floor(seconds % 60)

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}

export const healthHandler = (res: Response): Response => {
  const healthMessage = {
    status: 'UP',
    up_time: formatTime(process.uptime()),
    info: {
      name: projectProperties.name,
      version: projectProperties.version,
    },
  }
  return res.status(200).send(healthMessage)
}

/**
 * @swagger
 * /api/v1/jwt/health:
 *  get:
 *   summary: Health check
 *   description: Check if the service is up and running
 *   responses:
 *    200:
 *     description: Service is up and running
 *     content:
 *      application/json:
 *       example:
 *        status: UP
 *        up_time: 00:00:00
 *        info:
 *         name: JWT Manager
 *         version: 1.0.0
 */
export const healthRoute: HealthRouteFnType = (router: Router): Router =>
  router.get('/health', (req, res) => healthHandler(res))

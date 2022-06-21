import { setJWTRoute } from './set-jwt'
import { healthRoute } from './health'
import { Router } from 'express'
import { validateJWTRoute } from './validate-jwt'

/**
 * Create a Router type handler for each path, and set it in router.use
 */

export const routesArray = (router: Router) => [
  validateJWTRoute(router),
  setJWTRoute(router),
  healthRoute(router),
]

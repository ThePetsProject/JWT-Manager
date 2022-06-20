import { setHashRoute } from './set-hash'
import { healthRoute } from './health'
import { Router } from 'express'

/**
 * Create a Router type handler for each path, and set it in router.use
 */

export const routesArray = (router: Router) => [
  setHashRoute(router),
  healthRoute(router),
]

import { setJWTRoute } from './set-jwt'
import { healthRoute } from './health'
import { Router } from 'express'
import { validateJWTRoute } from './validate-jwt'
import { refreshJWTRoute } from './refresh-jwt'

export const routesArray = (router: Router) => [
  validateJWTRoute(router),
  refreshJWTRoute(router),
  setJWTRoute(router),
  healthRoute(router),
]

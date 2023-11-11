import express from 'express'
import cors from 'cors'
import { routesArray } from './infrastructure/routes'

import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const app = express()
const router = express.Router()

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'JWT Manager',
      version: '1.0.0',
      description: 'Manages Json Web Tokens',
    },
  },
  apis: ['src/infrastructure/routes/**/index.ts'],
}

const swaggerSpec = swaggerJsdoc(swaggerOptions)

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api/v1/jwt', routesArray(router))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

export default app

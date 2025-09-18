import express from 'express'
import swaggerUi from 'swagger-ui-express'
import { RegisterRoutes } from '../routes/routes'
import { connectDB } from '../database/mongoDB/config/mongodb'
import { main } from '.'
import swaggerSpec from '../routes/swagger/swagger.json'
import { errorHandler } from '../middleware/erro-handler'
import cors from 'cors'
import delayResponse from '../middleware/delay'
import { initSocket } from '../socket'
import { createServer } from 'http'
import dotenv from 'dotenv'
async function Server() {
  dotenv.config()
  const app = express()

  app.use(express.json())

  app.use(cors())
  const apiRouter = express.Router()
  RegisterRoutes(apiRouter)

  app.use('/api', apiRouter)
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

  app.use(delayResponse)
  app.use(errorHandler)

  const httpServer = createServer(app)

  initSocket(httpServer)
  const port = 3000
  httpServer.listen(port, async () => {
    console.log('Servidor rodando na porta', port)
    await connectDB()
    await main()
  })
}

Server()

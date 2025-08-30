import express from 'express'
import swaggerUi from 'swagger-ui-express'
import { RegisterRoutes } from '../routes/routes'
import { connectDB } from '../database/mongoDB/config/mongodb'
import { main } from '.'
import swaggerSpec from '../routes/swagger/swagger.json'
import { errorHandler } from '../middleware/erro-handler'
async function Server() {
  const app = express()

  app.use(express.json())

  const apiRouter = express.Router()
  RegisterRoutes(apiRouter)

  app.use('/api', apiRouter)
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

  app.use(errorHandler)

  const port = 3000
  app.listen(port, async () => {
    console.log('Servidor rodando na porta', port)
    await connectDB()
    await main()
  })
}

Server()

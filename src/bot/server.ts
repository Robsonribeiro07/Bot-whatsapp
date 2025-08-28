import express from 'express'
import swaggerUi from 'swagger-ui-express'
import { userRoutes } from '../routes/user'
import { swaggerSpec } from '../routes/swagger/swagger'
import { connectDB } from '../database/mongoDB/config/mongodb'
import { main } from '.'

async function Server() {
  const app = express()

  app.use(express.json())

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  app.use('/user', userRoutes)

  const port = 3000

  app.listen(port, async () => {
    console.log('servidor rodando', port)
    await connectDB()

    await main()
  })
}
Server()

import swaggerJsdoc from 'swagger-jsdoc'
import path from 'path'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Minha API',
      version: '1.0.0',
      description: 'Documentação automática da minha API',
    },
  },
  // Caminho absoluto relativo ao root do projeto
  apis: [path.join(__dirname, '../../controllers/**/*.ts')],
}

export const swaggerSpec = swaggerJsdoc(options)

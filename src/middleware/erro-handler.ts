import { ErrorRequestHandler } from 'express'
import { ValidateError } from 'tsoa'

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof ValidateError) {
    return res.status(400).json({
      message: 'Erro de validaçao',
      details: err.fields,
    })
  }
}

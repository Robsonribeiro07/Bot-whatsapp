import express from 'express'

async function delayResponse(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  const delay = 1000

  setTimeout(() => {
    next()
  }, delay)
}

export default delayResponse

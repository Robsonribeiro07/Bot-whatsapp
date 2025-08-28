import { Router } from 'express'
import { createUserController } from '../controllers/user/create-new-user'

const userRoutes = Router()

userRoutes.post('/', createUserController)

export { userRoutes }

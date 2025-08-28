import { Request, Response } from 'express'
import { IUserSchema } from '../../database/mongoDB/user-schema'
import { userServiceCreate } from '../../services/users/create-user'
import { findUserController } from './find-user'
import { connectBotController } from '../bot/connect'
import { IGroupSchema } from '../../database/mongoDB/models/group/group-schema'

interface IcreateUserController {
  id?: string
  name: string
  number: string
  groups?: IGroupSchema
  _id: string
}
/**
 * @openapi
 * /user:
 *   post:
 *     tags:
 *       - Users
 *     summary: Cria um novo usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               name:
 *                 type: string
 *               number:
 *                 type: string
 *               id:
 *                 type: string
 *               groups:
 *                 type: object
 *                 description: Dados do grupo do usuário
 *     responses:
 *       200:
 *         description: Usuário criado com sucesso
 *       403:
 *         description: Usuário já existe
 *       500:
 *         description: Erro interno do servidor
 */
const createUserController = async (
  req: Request<{}, {}, IcreateUserController>,
  res: Response,
) => {
  const { _id, name, number, id, groups } = req.body

  try {
    const existingUser = await findUserController({ jid: _id })

    if (existingUser) {
      console.log('userExisting')
      return res.status(403).json({ message: 'Usuario ja existe' })
    }

    const user = await userServiceCreate({ id, name, number, groups })

    if (!user) return

    await connectBotController(user?._id)

    return res.status(200).json({ message: 'sucessed', user })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Erro interno do servidor' })
  }
}

export { createUserController }

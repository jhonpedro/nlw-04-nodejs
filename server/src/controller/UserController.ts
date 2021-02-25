import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import UserRepository from '../repositories/UserRepository'

class UserController {
	static async create(req: Request, res: Response) {
		const { name, email } = req.body

		const userRepository = getCustomRepository(UserRepository)

		const user = userRepository.create({
			name,
			email: email.toLowerCase(),
		})

		try {
			await userRepository.save(user)
			return res.sendStatus(201)
		} catch (error) {
			return res
				.status(401)
				.json({ message: 'this user probably already exist' })
		}
	}
}

export default UserController

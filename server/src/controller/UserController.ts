import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import User from '../models/User'

class UserController {
	static async create(req: Request, res: Response) {
		const { name, email } = req.body

		const userRepository = getRepository(User)

		const user = userRepository.create({
			name,
			email: email.toLowerCase(),
		})

		try {
			await userRepository.save(user)
		} catch (error) {
			return res
				.status(401)
				.json({ message: 'this user probably already exist' })
		}

		return res.sendStatus(201)
	}
}

export default UserController

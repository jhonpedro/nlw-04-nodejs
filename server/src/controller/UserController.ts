import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import * as yup from 'yup'

import UserRepository from '../repositories/UserRepository'
import AppError from '../utils/Errors/AppError'

class UserController {
	static async create(req: Request, res: Response) {
		const { name, email } = req.body

		const schema = yup.object().shape({
			name: yup.string().min(4).required(),
			email: yup.string().email().required(),
		})

		try {
			await schema.validate(req.body, { abortEarly: false })
		} catch (error) {
			throw new AppError(error.errors)
		}

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

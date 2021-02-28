import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import SurveysUsersRepository from '../repositories/SurveysUsersRepository'
import AppError from '../utils/Errors/AppError'

class AnswerController {
	static async execute(req: Request, res: Response) {
		const { value } = req.params
		const { u: surveysUsers_id } = req.query

		const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)

		const surveyUser = await surveysUsersRepository.findOne({
			id: String(surveysUsers_id),
		})

		if (!surveyUser) {
			throw new AppError('survey user do not exist')
		}

		surveyUser.value = Number(value)

		await surveysUsersRepository.save(surveyUser)

		return res.json(surveyUser)
	}
}

export default AnswerController

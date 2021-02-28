import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import SurveyRepository from '../repositories/SurveyRepository'
import AppError from '../utils/Errors/AppError'

class SurveyController {
	static async create(req: Request, res: Response) {
		const { title, description } = req.body

		const surveysRepository = getCustomRepository(SurveyRepository)

		const survey = surveysRepository.create({ title, description })

		try {
			await surveysRepository.save(survey)
			return res.status(201).json(survey)
		} catch (err) {
			throw new AppError('an error ocurred in survey')
		}
	}
	static async show(req: Request, res: Response) {
		const surveysRepository = getCustomRepository(SurveyRepository)

		const surveys = await surveysRepository.find()

		return res.json(surveys)
	}
}

export default SurveyController

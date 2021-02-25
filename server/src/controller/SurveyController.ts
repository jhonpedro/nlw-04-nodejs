import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import SurveyRepository from '../repositories/SurveyRepository'

class SurveyController {
	static async create(req: Request, res: Response) {
		const { title, description } = req.body

		const surveysRepository = getCustomRepository(SurveyRepository)

		const survey = surveysRepository.create({ title, description })

		try {
			await surveysRepository.save(survey)
			return res.status(201).json(survey)
		} catch (error) {
			console.log(error)
			return res.status(400).json({ message: 'an error ocurred in survey' })
		}
	}
	static async show(req: Request, res: Response) {
		const surveysRepository = getCustomRepository(SurveyRepository)

		const surveys = await surveysRepository.find()

		return res.json(surveys)
	}
}

export default SurveyController

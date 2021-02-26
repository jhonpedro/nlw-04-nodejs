import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { resolve } from 'path'

import SurveyRepository from '../repositories/SurveyRepository'
import SurveysUsersRepository from '../repositories/SurveysUsersRepository'
import UserRepository from '../repositories/UserRepository'
import SendMailService from '../services/SendMailService'

class SendMailController {
	static async execute(req: Request, res: Response) {
		const { email, survey_id } = req.body

		const userRepository = getCustomRepository(UserRepository)
		const surveyRepository = getCustomRepository(SurveyRepository)
		const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)

		const user = await userRepository.findOne({ email })

		if (!user) {
			return res.status(400).json({ message: 'user do not exists' })
		}

		const survey = await surveyRepository.findOne({ id: survey_id })

		if (!survey) {
			return res.status(400).json({ message: 'survey do not exists' })
		}

		const surveyUserToCreate = surveysUsersRepository.create({
			user_id: user.id,
			survey_id,
		})

		const surveyUser = await surveysUsersRepository.findOne({
			where: [{ user_id: user.id }, { value: null }],
			relations: ['user', 'survey'],
		})

		if (!surveyUser) {
			await surveysUsersRepository.save(surveyUserToCreate)
		}

		const variables = {
			name: user.name,
			title: survey.title,
			description: survey.description,
			user_id: user.id,
			url: process.env.URL_MAIL,
		}

		await SendMailService.execute({
			to: user.email,
			subject: survey.title,
			variables,
			path: resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs'),
		})

		return res.json(surveyUser)
	}
}

export default SendMailController

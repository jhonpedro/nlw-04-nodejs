import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { resolve } from 'path'

import SurveyRepository from '../repositories/SurveyRepository'
import SurveysUsersRepository from '../repositories/SurveysUsersRepository'
import UserRepository from '../repositories/UserRepository'
import SendMailService from '../services/SendMailService'
import AppError from '../utils/Errors/AppError'

class SendMailController {
	static async execute(req: Request, res: Response) {
		const { email, survey_id } = req.body

		const userRepository = getCustomRepository(UserRepository)
		const surveyRepository = getCustomRepository(SurveyRepository)
		const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)

		const user = await userRepository.findOne({ email })

		if (!user) {
			throw new AppError('user do not exist')
		}

		const survey = await surveyRepository.findOne({ id: survey_id })

		if (!survey) {
			throw new AppError('survey do not exist')
		}

		const variables = {
			name: user.name,
			title: survey.title,
			description: survey.description,
			id: '',
			url: process.env.URL_MAIL,
		}

		const surveyUserToSave = surveysUsersRepository.create({
			user_id: user.id,
			survey_id,
		})

		const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
			where: { user_id: user.id, survey_id },
			relations: ['user', 'survey'],
		})

		if (surveyUserAlreadyExists) {
			variables.id = surveyUserAlreadyExists.id

			console.log('alredy exist sending same')

			await SendMailService.execute({
				to: email,
				subject: survey.title,
				variables,
				path: resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs'),
			})

			return res.json(surveyUserAlreadyExists)
		} else {
			variables.id = surveyUserToSave.id
			await surveysUsersRepository.save(surveyUserToSave)
		}
		console.log('dont exis sending different')

		await SendMailService.execute({
			to: email,
			subject: survey.title,
			variables,
			path: resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs'),
		})

		return res.json(surveyUserToSave)
	}
}

export default SendMailController

import { Request, Response } from 'express'
import { getCustomRepository, IsNull, Not } from 'typeorm'
import SurveysUsersRepository from '../repositories/SurveysUsersRepository'

class NpsController {
	static async execute(req: Request, res: Response) {
		const { survey_id } = req.params

		const surveysUsersRepository = await getCustomRepository(
			SurveysUsersRepository
		)

		const surveysUsers = await surveysUsersRepository.find({
			survey_id,
			value: Not(IsNull()),
		})

		const detractors = []
		const passives = []
		const promoters = []

		for (let i = 0; i < surveysUsers.length; i++) {
			if (surveysUsers[i].value <= 6 && surveysUsers[i].value >= 0) {
				detractors.push(surveysUsers[i])
			} else if (surveysUsers[i].value === 7 || surveysUsers[i].value === 8) {
				passives.push(surveysUsers[i])
			} else {
				promoters.push(surveysUsers[i])
			}
		}

		const npsCalculus =
			((promoters.length - detractors.length) / surveysUsers.length) * 100

		return res.json({
			nps: npsCalculus.toFixed(2),
			detractors,
			passives,
			promoters,
		})
	}
}

export default NpsController

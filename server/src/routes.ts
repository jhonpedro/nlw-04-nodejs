import { Router } from 'express'

import AnswerController from './controller/AnswerController'
import SendMailController from './controller/SendMailController'
import NpsController from './controller/NpsController'
import SurveyController from './controller/SurveyController'
import UserController from './controller/UserController'

const router = Router()

router.post('/users', UserController.create)

router.get('/surveys', SurveyController.show)
router.post('/surveys', SurveyController.create)

router.post('/sendMail', SendMailController.execute)

router.get('/answers/:value', AnswerController.execute)

router.get('/nps/:survey_id', NpsController.execute)

export default router

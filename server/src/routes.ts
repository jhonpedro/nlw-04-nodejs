import { Router } from 'express'
import SendMailController from './controller/SendMailController'

import SurveyController from './controller/SurveyController'
import UserController from './controller/UserController'

const router = Router()

router.post('/users', UserController.create)

router.get('/surveys', SurveyController.show)
router.post('/surveys', SurveyController.create)

router.post('/sendMail', SendMailController.execute)

export default router

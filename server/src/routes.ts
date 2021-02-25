import { Router } from 'express'

import SurveyController from './controller/SurveyController'
import UserController from './controller/UserController'

const router = Router()

router.post('/users', UserController.create)

router.get('/surveys', SurveyController.show)
router.post('/surveys', SurveyController.create)

export default router

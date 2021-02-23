import { Router } from 'express'
import UserController from './controller/UserController'

const router = Router()

router.post('/users', UserController.create)

export default router

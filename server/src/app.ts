import 'reflect-metadata'
import express from 'express'
import 'express-async-errors'
import { createConnection } from 'typeorm'
import './database'
import router from './routes'
import errorHandleMiddleware from './utils/Errors/ErrorHandleMiddleware'

createConnection()

const app = express()

app.use(express.json())
app.use(router)
app.use(errorHandleMiddleware)

export default app

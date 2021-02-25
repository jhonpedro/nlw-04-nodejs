import 'reflect-metadata'
import express from 'express'
import { createConnection } from 'typeorm'
import './database'

createConnection()
import router from './routes'

const app = express()

app.use(express.json())
app.use(router)

export default app

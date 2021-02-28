import { NextFunction, Request, Response } from 'express'
import AppError from './AppError'

export default function (err, req: Request, res: Response, next: NextFunction) {
	if (err instanceof AppError) {
		return res.status(err.statusCode).json({ message: err.message })
	}

	return res.status(500).json({ message: err.message })
}

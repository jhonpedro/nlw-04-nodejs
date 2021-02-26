import nodemailer, { Transporter } from 'nodemailer'
import handlebars from 'handlebars'
import { resolve } from 'path'
import { readFileSync } from 'fs'

interface ExecuteProps {
	to: string
	subject: string
	variables: object
	path: string
}

class SendMailService {
	private client: Transporter

	constructor() {
		nodemailer.createTestAccount().then((account) => {
			const transporter = nodemailer.createTransport({
				host: account.smtp.host,
				port: account.smtp.port,
				secure: account.smtp.secure, // true for 465, false for other ports
				auth: {
					user: account.user, // generated ethereal user
					pass: account.pass, // generated ethereal password
				},
			})

			this.client = transporter
		})
	}

	async execute({ to, subject, variables, path }: ExecuteProps) {
		const templateNps = readFileSync(path).toString('utf-8')

		const mailTemplateToParse = handlebars.compile(templateNps)

		const htmlToSend = mailTemplateToParse(variables)

		const message = await this.client.sendMail({
			to,
			subject,
			html: htmlToSend,
			from: 'NPS <noreply@nps.com>',
		})

		console.log('Message sent: %s', message.messageId)
		// Preview only available when sending through an Ethereal account
		console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message))
	}
}

export default new SendMailService()

import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import { validateMessage } from './utils.js';

process.loadEnvFile();

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_TARGET = process.env.EMAIL_TARGET;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

const app = express();

app.use(cors());
app.use(express.json());

app.post('/email', async (req, res) => {
	const validation = validateMessage(req.body);

	if (!validation.valid) {
		res.status(400).json({
			success: false,
			errors: validation.errors,
		});
		return;
	}

	const { name, email, message } = validation.data;

	try {
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: EMAIL_USER,
				pass: EMAIL_PASSWORD,
			},
		});

		const mailOptions = {
			from: EMAIL_USER,
			replyTo: email,
			to: EMAIL_TARGET,
			subject: `New message from ${name}`,
			text: message,
		};

		await transporter.sendMail(mailOptions);

		res.status(200).json({
			success: true,
			message: 'Email sent successfully!',
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: 'Error sending email.',
		});
	}
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Running server on port ${PORT}`);
});

export default app;

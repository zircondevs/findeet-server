import mailjet, { Email } from 'node-mailjet';
import {
	mailGunEmailerFormat,
	mailModelType,
	recieverEmailFormatted,
	sendMailPayload,
	Status,
} from './MailTypes';
import { templatingEngine } from './templates/index';
import { v4 as uuidV4 } from 'uuid';
import { config } from 'dotenv';
import MailModel from './MailModel';

config();

export const connectMailJet = (): Email.Client => {
	const mailjetSecret: string | undefined = process.env.MAILJET_SECRETS;

	if (!mailjetSecret)
		throw new Error(
			'Mail Jet Credentials not found add `MAILJET_SECRETS` to the environment with the relevant credentials.'
		);

	const [firstKey, secondKey]: string[] = mailjetSecret.split(',');
	return mailjet.connect(firstKey, secondKey);
};

export const sendMail = async (payload: sendMailPayload) => {
	const customID: string = uuidV4();
	try {
		const configuredSender: Email.Client = connectMailJet(),
			recieverEmailFormatted: mailGunEmailerFormat = {
				From: {
					Email:
                        process.env.SENDER_EMAIL || 'zircondevs.tech@gmail.com',
					Name: process.env.SENDER_NAME || 'Michael',
				},
				To: payload.recievers.map(email => ({
					Email: email,
					Name: '',
				})),
			},
			sendMailContent: recieverEmailFormatted = {
				...recieverEmailFormatted,
				Subject: payload.subject,
				HTMLPart: templatingEngine[payload.templateType](),
				CustomID: customID,
			},
			/**eslint-disable-next-line */
			result: object = (
				await configuredSender
					.post('send', {
						version: 'v3.1',
					})
					.request({
						Messages: [sendMailContent],
					})
			).body;

		if (Object.keys(result).includes('Messages')) {
			const res: Email.PostResponseData =
                result as Email.PostResponseData;
			const mailjetTo: Email.PostResponseDataTo[] = Array.from(
				res.Messages[0].To
			),
				constructedData: mailModelType[] = mailjetTo.map(
					(mailSentTo: Email.PostResponseDataTo) =>
						new MailModel({
							status: Status.SUCCESS,
							customID: res.Messages[0].CustomID,
							messageID: mailSentTo.MessageID.toString(),
							messageUUID: mailSentTo.MessageUUID,
							email: mailSentTo.Email,
							mailSentFrom: payload.mailSentFrom,
						})
				);

			await MailModel.insertMany(constructedData);

			return true;
		}

		const constructedData: mailModelType[] = payload.recievers.map(
			(reciever: string) => ({
				status: Status.FAILED,
				customID,
				email: reciever,
				error: JSON.stringify(result),
				mailSentFrom: payload.mailSentFrom,
			})
		);

		await MailModel.insertMany(constructedData);

		throw result;
	} catch (error) {
		const constructedData: mailModelType[] = payload.recievers.map(
			(reciever: string) => ({
				status: Status.FAILED,
				customID,
				email: reciever,
				error: JSON.stringify(error),
				mailSentFrom: payload.mailSentFrom,
			})
		);

		await MailModel.insertMany(constructedData);

		throw error;
	}
};

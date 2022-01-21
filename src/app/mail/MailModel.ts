import { Schema, model } from 'mongoose';
import { mailModelType } from './MailTypes';

const schema = new Schema<mailModelType>(
	{
		customID: {
			type: String,
			required: true,
		},
		messageUUID: {
			type: String,
		},
		messageID: {
			type: String,
		},
		email: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			required: true,
		},
		error: {
			type: String,
		},
		mailSentFrom: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
		toJSON: {
			// transform: (_, _) => {},
		},
	}
);

export default model<mailModelType>('mails', schema);

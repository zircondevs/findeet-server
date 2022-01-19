import { model, Schema } from 'mongoose';
import { UserModelInterface } from './UserTypes';

const schema: Schema = new Schema<UserModelInterface>(
	{
		password: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			lowercase: true,
			required: true,
		},
		'2faDetails': {
			type: Object,
		},
		enabled2fa: {
			type: Boolean,
			default: false,
		},
		emailVerified: {
			type: Boolean,
			default: false,
		},
		emailVerifiedOn: {
			type: String,
		},
		name: {
			type: String,
		},
		address: {
			type: String,
		},
	},
	{
		timestamps: true,
		toJSON: {
			transform: ret => {
				ret.id = ret._id;
				delete ret.password;
				delete ret['2faDetails'];
				delete ret.emailVerifiedOn;
			},
		},
	}
);

export default model<UserModelInterface>('users', schema);

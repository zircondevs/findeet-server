import Joi from 'joi';
import { Request } from 'express';
import { axiosAPIWrapper, expectedDataFormat } from '../helper';

export const emailPasswordValidator = axiosAPIWrapper(
	async (req: Request): Promise<expectedDataFormat> => {
		const loginFormSchema = Joi.object().keys({
				email: Joi.string().email().required().messages({
					'any.required': 'Email is required',
					'string.empty': 'Email cannot be empty',
					'string.email': 'Email must be valid',
				}),
				password: Joi.string().min(6).max(15).required().messages({
					'any.required': 'Password is required',
					'string.empty': 'Password cannot be empty',
					'string.min':
                        'Password must be a min of 6 and maximum of 15 characters',
				}),
			}),
			{ error } = loginFormSchema.validate(req.body);

		if (error)
			return {
				status: 400,
				message: error.details[0].message,
			};

		return {
			status: 200,
			next: true,
		};
	}
);

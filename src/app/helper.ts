import { NextFunction } from 'connect';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';

export interface expectedDataFormat {
    status: number;
    message?: string;
    error?: unknown;
    data?: unknown;
    next?: boolean;
}

type callbackFunction = {
    (req: Request): Promise<expectedDataFormat>;
};

export const axiosAPIWrapper =
    (callback: callbackFunction) =>
    	async (req: Request, res: Response, next: NextFunction) => {
    		try {
    			const response: expectedDataFormat = await callback(req);

    			if (response.next) return next();

    			const status: number = response.status,
    				returnJSON = {
    					...response,
    					status: undefined,
    				};

    			return res.status(status).json(returnJSON);
    		} catch (error) {
    			console.log(error);
    			return res.status(500).json({ error: 'Server error' });
    		}
    	};

export const bcryptHasher = (
	text: string | Buffer,
	salt: number | string = 10
): string => bcrypt.hashSync(text, salt);

export const bcryptCompareHashWithText = (
	text: string | Buffer,
	hashedString: string
): boolean => bcrypt.compareSync(text, hashedString);

export const tokenSigner = (
	payload: object | string | Buffer,
	expiresIn: string | number = 60 * 60 * 5
): string =>
	JWT.sign(payload, process.env.SECRET_KEY || '', {
		expiresIn,
	});

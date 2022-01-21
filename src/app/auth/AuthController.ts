import { Request } from 'express';
import {
    axiosAPIWrapper,
    bcryptCompareHashWithText,
    bcryptHasher,
    expectedDataFormat,
    tokenSigner,
} from '../helper';
import { mailContentKeys, templateType } from '../mail/MailTypes';
import TemplatedMailSender from '../mail/TemplatedMailSender';
import UserModel from '../users/UserModel';
import { UserModelInterface } from '../users/UserTypes';

export const loginController = axiosAPIWrapper(
    async (req: Request): Promise<expectedDataFormat> => {
        const user: UserModelInterface | null = await UserModel.findOne({
            email: req.body.email.toLowerCase(),
        });

        if (!user)
            return {
                status: 404,
                message: 'Invalid login credentials',
            };

        if (!bcryptCompareHashWithText(req.body.password, user.password))
            return {
                status: 409,
                message: 'Invalid login credentials',
            };

        if (!user.emailVerified) {
            const val = await TemplatedMailSender({
                mailType: mailContentKeys.EMAIL_VERIFICATION,
                template: templateType.verification,
                mailSentFrom: 'auth/login',
                content: {
                    subject: 'Email Verification',
                    otp: String(Math.random()).substring(2, 8),
                },
                recievers: [user.email],
            });
            // await sendMail({
            //     recievers: [user.email],
            //     templateType: templateType.default,
            //     mailSentFrom: 'auth/login',
            //     subject: 'Email Verification',
            // });
            console.log('Val >>>> ', val);

            return {
                status: 412,
                message: 'Verify email address',
            };
        }

        // TODO - implement 2fa login for users that enabled 2fa

        // Sign Tokwn
        const token: string = tokenSigner({
            id: user._id,
            email: user.email,
        });

        return {
            status: 200,
            message: 'Reached the login controller',
            data: {
                token,
                user: await user.toJSON(),
            },
        };
    }
);

export const registerController = axiosAPIWrapper(
    async (req: Request): Promise<expectedDataFormat> => {
        const user: UserModelInterface | null = await UserModel.findOne({
            email: req.body.email.toLowerCase(),
        });

        if (user)
            return {
                status: 404,
                message: 'Email has been used',
            };

        const hashedPassword: string = bcryptHasher(req.body.password),
            newUser: UserModelInterface = new UserModel({
                email: req.body.email.toLowerCase(),
                password: hashedPassword,
            });

        await newUser.save();

        // Sign Tokwn
        // const token: string = tokenSigner({
        // 	email: newUser.email,
        // });

        // send verification mail
        await TemplatedMailSender({
            mailType: mailContentKeys.EMAIL_VERIFICATION,
            template: templateType.verification,
            mailSentFrom: 'auth/register',
            content: {
                subject: 'Email Verification',
                otp: String(Math.random()).substring(2, 8),
            },
            recievers: [newUser.email],
        });
        // await sendMail({
        // 	templateType: templateType.default,
        // 	recievers: [newUser.email],
        // 	subject: 'Email Verification',
        // 	mailSentFrom: 'auth/register',
        // });

        return {
            status: 200,
            message: 'Registration successful verify your email',
        };
    }
);

import { sendMail } from './MailService';
import {
    mailContentFormat,
    mailContentKeys,
    mailContents,
    templateSenderPayload,
} from './MailTypes';

// define types for this structure
const mailStructure = {
    [mailContentKeys.EMAIL_VERIFICATION]({
        otp,
    }: mailContents): mailContentFormat {
        return {
            text: 'Verify you email password with the OTP provided within the next 5 minutes:',
            otp: otp || String(Math.random()).substring(2, 8),
        };
    },
};

export default async ({
    mailType,
    template,
    content,
    mailSentFrom,
    recievers,
}: templateSenderPayload): Promise<boolean> => {
    const formattedContents: mailContentFormat =
        mailStructure[mailType](content);

    return await sendMail({
        recievers,
        templateType: template,
        content: formattedContents,
        mailSentFrom,
        subject: content.subject,
    });
};

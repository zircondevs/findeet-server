import { templatesPayload } from '../MailTypes';

export default ({ text, otp, name }: templatesPayload): string => `
     <html>
        <body>
            <p>Dear ${name ? name : 'Customer'}</p>
            <p>${text}<p>
            <p><strong>${otp}</strong></p>
        </body>
    </html>
`;

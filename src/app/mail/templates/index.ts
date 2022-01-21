import defaultTemplate from './default';
import { templateType, templatingEngine as templateEngine } from '../MailTypes';
import verificationTemplate from './verification';

export const templatingEngine: templateEngine = {
    [templateType.default]: defaultTemplate,
    [templateType.verification]: verificationTemplate,
};

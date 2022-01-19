export enum templateType {
    default = 'default',
}

export interface sendMailPayload {
    subject: string;
    recievers: string[];
    templateType: templateType;
    mailSentFrom: string;
}

export interface addressFormat {
    Email: string;
    Name: string;
}

export interface mailGunEmailerFormat {
    From: addressFormat;
    To: addressFormat[];
}

export interface recieverEmailFormatted extends mailGunEmailerFormat {
    Subject: string;
    HTMLPart: string;
    CustomID: string;
}

export interface templatingEngine {
    default: () => string;
}

export interface mailjetReponseMessageTo {
    Email: string;
    MessageUUID: string;
    MessageID: string;
    MessageHref: string;
}

export interface mailjetResponseMessages {
    Status: string;
    CustomID: string;
    To: mailjetReponseMessageTo[];
    Cc: [] | string[];
    Bcc: [] | string[];
}

export interface mailjetResponse {
    Messages: mailjetResponseMessages[];
}

export enum Status {
    SUCCESS = 'success',
    FAILED = 'failed',
}

export interface mailModelType {
    customID: string;
    messageUUID?: string;
    messageID?: string;
    email: string;
    status: Status;
    error?: string;
    mailSentFrom: string;
}

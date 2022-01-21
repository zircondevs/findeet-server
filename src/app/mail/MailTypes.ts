export enum templateType {
    default = 'default',
    verification = 'verification',
}

export enum mailContentKeys {
    EMAIL_VERIFICATION = 'email_verification',
}

export interface mailContentFormat {
    text: string;
    otp: number | string;
}

export interface mailContents {
    otp?: number | string;
    subject: string;
}

export interface templateSenderPayload {
    mailType: mailContentKeys;
    template: templateType;
    content: mailContents;
    mailSentFrom: string;
    recievers: string[];
}

export interface sendMailPayload {
    subject: string;
    recievers: string[];
    templateType: templateType;
    mailSentFrom: string;
    content: mailContentFormat;
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
    [templateType.default](payload: templatesPayload): string;
    [templateType.verification](payload: templatesPayload): string;
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

export interface templatesPayload {
    otp?: string | number;
    text?: string;
    name?: string;
}

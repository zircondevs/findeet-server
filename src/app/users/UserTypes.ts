export interface UserModelInterface {
    save(): void;
    _id: string;
    name?: string;
    email: string;
    password: string;
    emailVerified?: boolean;
    enabled2fa?: boolean;
    '2faDetails'?: object;
    address?: string;
    emailVerifiedOn?: string;
    toJSON(): object;
}

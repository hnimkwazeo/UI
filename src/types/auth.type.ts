import type { IUser } from "types/user.type";

export interface ILoginCredentials {
    username: string;
    password: string;
}

export interface IRegisterPayload {
    name: string;
    email: string;
    password: string;
}

export interface ILoginResponse {
    accessToken: string;
    user: IUser;
}

export interface IForgotPasswordPayload {
    email: string;
}

export interface IResetPasswordPayload {
    email: string;
    otp: string;
    newPassword: string;
}
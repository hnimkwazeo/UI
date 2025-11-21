import type { IForgotPasswordPayload, ILoginCredentials, ILoginResponse, IRegisterPayload, IResetPasswordPayload } from "types/auth.type";
import type { IResponse } from "types/backend";
import instance from "services/axios.customize";

export const loginAPI = (data: ILoginCredentials) => {
    return instance.post<IResponse<ILoginResponse>>(`/api/v1/auth/login`, data);
}

export const loginGoogleAPI = (data: { code: string }) => {
    return instance.post<IResponse<ILoginResponse>>(`/api/v1/auth/google`, data);
}

export const registerAPI = (data: IRegisterPayload) => {
    return instance.post<IResponse<ILoginResponse>>(`/api/v1/auth/register`, data);
}


export const getAccountAPI = () => {
    return instance.get<IResponse<ILoginResponse>>(`/api/v1/auth/account`);
}

export const refreshTokenAPI = () => {
    return instance.post<IResponse<ILoginResponse>>('/api/v1/auth/refresh');
}

export const forgotPasswordAPI = (payload: IForgotPasswordPayload) => {
    return instance.post<IResponse<any>>('/api/v1/auth/forgot-password', payload);
}

export const resetPasswordAPI = (payload: IResetPasswordPayload) => {
    return instance.post<IResponse<any>>('/api/v1/auth/reset-password', payload);
}

export const logoutAPI = () => {
    return instance.post<IResponse<any>>(`/api/v1/auth/logout`);
}
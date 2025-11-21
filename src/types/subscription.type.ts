export interface IUser {
    id: number;
    email: string;
    name: string;
}

export interface IPlan {
    id: number;
    name: string;
    price: number;
    durationInDays: number;
}

export type TPaymentStatus = 'PENDING' | 'PAID' | 'FAILED';

export interface ISubscription {
    id: number;
    user: IUser;
    plan: IPlan;
    paymentStatus: TPaymentStatus;
    active: boolean;
    startDate: string;
    endDate: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
}
export interface IPlan {
    id: number;
    name: string;
    price: number;
    durationInDays: number;
    description: string;
    active: boolean;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
}

export interface ICreatePlan {
    name: string;
    price: number;
    durationInDays: number;
    description: string;
    active: boolean;
}

export interface IUpdatePlan extends ICreatePlan {
    id: number;
}
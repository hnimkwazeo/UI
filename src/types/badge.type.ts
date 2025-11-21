export interface IBadge {
    id: number;
    name: string;
    image: string;
    point: number;
    description: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
}

export interface ICreateBadge {
    name: string;
    description: string;
    image: string;
    point: number;
}

export interface IUpdateBadge extends ICreateBadge {
    id: number;
}
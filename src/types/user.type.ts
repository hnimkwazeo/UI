import type { IPermission } from "types/permission.type";

export interface IRole {
    id: number;
    name: string;
    permissions: IPermission[];
}

export interface IBadge {
    id: number;
    name: string;
    image: string;
}

export interface IUser {
    id: number;
    name: string;
    email: string;
    active: boolean;
    point: number;
    streakCount: number;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
    role: IRole;
    badge: IBadge;
}

export interface ICreateUser {
    name: string;
    email: string;
    password?: string;
    roleId: number;
    badgeId: number;
}

export interface IUpdateUser {
    id: number;
    email?: string;
    name?: string;
    roleId?: number;
    password?: string;
    active?: boolean;
}

export interface IUpdatePasswordUser {
    currentPassword: string;
    newPassword: string;
}
import type { IPermission } from "types/permission.type";

export interface IRole {
    id: number;
    name: string;
    description: string;
    active: boolean;
    permissions: IPermission[];
}

export interface IUpdateRole {
    id: number;
    name: string;
    description: string;
    active: boolean;
    permissionIds: number[];
}

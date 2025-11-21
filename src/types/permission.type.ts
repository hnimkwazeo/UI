export interface IPermission {
    id: number;
    name: string;
    apiPath: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    module: string;
}
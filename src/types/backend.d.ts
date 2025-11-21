export interface IMeta {
    page: number;
    pageSize: number;
    pages: number;
    total: number;
}

export interface IBackendRes<T> {
    statusCode: number;
    error: string | null;
    message: string;
    data: {
        meta: IMeta;
        result: T;
    };
}

export interface IResponse<T> {
    statusCode: number;
    error: string | null;
    message: string;
    data: T;
}
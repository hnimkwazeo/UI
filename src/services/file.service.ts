import type { IResponse } from "types/backend";
import instance from "./axios.customize";

interface IUploadFileResponse {
    fileName: string;
    fileUrl: string;
    originalName: string;
    fileSize: number;
}

export const uploadFileAPI = (file: File) => {
    const url_backend = `/api/v1/files/upload`;

    const formData = new FormData();
    formData.append('file', file);

    return instance.post<IResponse<IUploadFileResponse>>(url_backend, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}
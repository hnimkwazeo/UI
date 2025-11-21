export type IAttachmentType = 'IMAGE' | 'FILE';

export interface IAttachment {
    id: number;
    fileUrl: string;
    fileType: IAttachmentType;
    originalFileName: string;
    fileSize: number;
}

export interface ICreateAttachment {
    fileUrl: any;
    fileType: IAttachmentType;
    originalFileName: any;
    fileSize: any;
}
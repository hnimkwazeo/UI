import type { IAttachment, ICreateAttachment } from "types/attachment.type";
import type { IUser } from "types/user.type";

export interface IComment {
    id: number;
    content: string;
    user: IUser;
    attachments: IAttachment[];
    createdAt: string;
    updatedAt: string | null;
    replies: IComment[];
}

export interface ICreateComment {
    postId: number;
    parentCommentId: number | null;
    content: string;
    attachments: ICreateAttachment[];
}

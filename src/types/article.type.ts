export interface ICategory {
    id: number;
    name: string;
}

export interface IArticle {
    id: number;
    title: string;
    content: string;
    image?: string | null;
    audio?: string | null;
    category: ICategory;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
}

export interface ICreateArticle {
    title: string;
    content: string;
    image?: string | null;
    audio?: string | null;
    categoryId: number;
}

export interface IUpdateArticle extends ICreateArticle {
    id: number;
}
export interface ICategory {
    id: number;
    name: string;
}

export interface IVideo {
    id: number;
    title: string;
    description: string;
    url: string;
    duration: number;
    subtitle: string;
    category: ICategory;
    createdAt: string;
    updatedAt: string;
}

export interface ICreateVideo {
    id: number;
    title: string;
    description: string;
    url: string;
    subtitle: string;
    categoryId: number;
}

export interface IUpdateVideo extends ICreateVideo {
    id: number;
}
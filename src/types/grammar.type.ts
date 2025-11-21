export interface ICategory {
    id: number,
    name: string
}

export interface IGrammar {
    id: number;
    name: string;
    content: string;
    category: ICategory;
    createdAt: String;
    createdBy: String;
    updatedAt: String;
    updatedBy: String;
}

export interface ICreateGrammar {
    name: string;
    content: string;
    categoryId: number;
}

export interface IUpdateGrammar extends ICreateGrammar {
    id: number;
}
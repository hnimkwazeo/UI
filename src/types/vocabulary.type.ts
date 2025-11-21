export interface ICategory {
    id: number;
    name: string;
}

export interface IVocabulary {
    id: number;
    word: string;
    definitionEn: string;
    meaningVi: string;
    exampleEn: string;
    exampleVi: string;
    partOfSpeech: string;
    pronunciation: string;
    image: string;
    audio: string;
    category: ICategory;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
}

export interface ICreateVocabulary {
    word: string;
    definitionEn: string;
    meaningVi: string;
    exampleEn: string;
    exampleVi: string;
    partOfSpeech: string;
    pronunciation: string;
    image: string;
    audio: string;
    categoryId: number;
}

export interface IUpdateVocabulary extends ICreateVocabulary {
    id: number;
}
export interface IChoice {
    id: number;
    content: string | null;
    imageUrl: string | null;
    isCorrect: boolean;
}

export interface IQuestion {
    id: number;
    questionType: 'FILL_IN_BLANK'
    | 'LISTENING_COMPREHENSION'
    | 'MULTIPLE_CHOICE_IMAGE'
    | 'MULTIPLE_CHOICE_TEXT'
    | 'TRANSLATE_EN_TO_VI'
    | 'TRANSLATE_VI_TO_EN'
    | 'LISTENING_TRANSCRIPTION'
    | 'ARRANGE_WORDS';
    prompt: string;
    textToFill: string | null;
    correctSentence: string | null;
    audioUrl: string | null;
    imageUrl: string | null;
    points: number;
    questionOrder: number;
    relatedVocabularyId: number;
    choices: IChoice[];
}

export interface IQuiz {
    id: number;
    title: string;
    description: string;
    categoryId: number;
    categoryName: string;
    createdAt: string;
    updatedAt: string | null;
    questions: IQuestion[];
}


export interface ICreateChoice {
    content: string | null;
    imageUrl: string | null;
    isCorrect: boolean;
}

export interface ICreateQuestion {
    questionType: 'FILL_IN_BLANK'
    | 'LISTENING_COMPREHENSION'
    | 'MULTIPLE_CHOICE_IMAGE'
    | 'MULTIPLE_CHOICE_TEXT'
    | 'TRANSLATE_EN_TO_VI'
    | 'TRANSLATE_VI_TO_EN'
    | 'LISTENING_TRANSCRIPTION'
    | 'ARRANGE_WORDS';
    prompt: string;
    textToFill: string | null;
    correctSentence: string | null;
    audioUrl: string | null;
    imageUrl: string | null;
    points: number;
    questionOrder: number;
    choices: ICreateChoice[];
}

export interface ICreateQuiz {
    title: string;
    description: string;
    categoryId: number;
    questions: ICreateQuestion[];
}

// quiz review

export interface IGeneratedQuiz {
    id: number;
    title: string;
    description: string;
    questions: IQuestion[];
}

export interface IQuizAttemptStart {
    attemptId: number;
    quizTitle: string;
    questions: IQuestion[];
}

export interface IAnswerPayload {
    questionId: number;
    selectedChoiceId?: number | null;
    userAnswerText?: string | null;
}

export interface ISubmitPayload {
    userQuizAttemptId: number;
    answers: IAnswerPayload[];
}

export interface IQuizAttemptResult {
    id: number,
    quizId: number,
    quizTitle: string,
    status: 'IN_PROGRESS' | 'COMPLETED',
    score: number,
    totalPoints: number,
    startedAt: string,
    completedAt: string,
    userAnswers: {
        questionId: number;
        selectedChoiceId?: number;
        userAnswerText?: string;
        isCorrect: boolean;
    }[];
}

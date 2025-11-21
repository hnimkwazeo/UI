export interface IDashboardBadge {
    id: number;
    name: string;
    image: string;
}

export interface IDashboardPlan {
    name: string;
}

export interface IVocabularyLevelCounts {
    [level: string]: number;
}

export interface IUserDashboard {
    userPoints: number,
    wordsToReviewCount: number,
    totalVocabulary: number;
    vocabularyLevelCounts: IVocabularyLevelCounts;
    totalQuizzesCompleted: number;
    averageQuizScore: number;
    currentStreak: number;
    badges: IDashboardBadge | null;
    currentPlan: IDashboardPlan | null;
    subscriptionExpiryDate: string | null;
}

export interface IContentCount {
    vocabularies: number;
    quizzes: number;
    articles: number;
    posts: number;
}

export interface IChartDataPoint {
    date: string;
    value: number;
}

export interface IDashboardData {
    totalUsers: number;
    newUsersThisMonth: number;
    totalActiveSubscriptions: number;
    totalRevenue: number;
    revenueThisMonth: number;
    contentCount: IContentCount;
    newUserRegistrationsChart: IChartDataPoint[];
    premiumUpgradesChart: IChartDataPoint[];
    revenueChart: IChartDataPoint[];
}
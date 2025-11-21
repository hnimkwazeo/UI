export interface IRevenueByPlan {
    planId: number;
    planName: string;
    transactionCount: number;
    totalRevenue: number;
}

export interface IRevenueStats {
    startDate: string;
    endDate: string;
    totalRevenue: number;
    totalTransactions: number;
    revenueByPlan: IRevenueByPlan[];
}
export interface IMetricMeasurement {
    statistic: 'COUNT' | 'TOTAL_TIME' | 'MAX' | 'VALUE';
    value: number;
}

export interface IMetric {
    name: string;
    description: string | null;
    baseUnit: string | null;
    measurements: IMetricMeasurement[];
}
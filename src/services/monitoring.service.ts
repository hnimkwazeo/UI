import instance from "services/axios.customize";
import type { IResponse } from "types/backend";
import type { IMetric } from "types/monitoring.type";

export const fetchLogfileAPI = () => {
    return instance.get<string>(`/actuator/logfile`, {
        transformResponse: [(res) => res],
    });
}

export const fetchMetricAPI = (metricName: string) => {
    return instance.get<IResponse<IMetric>>(`/actuator/metrics/${metricName}`);
}
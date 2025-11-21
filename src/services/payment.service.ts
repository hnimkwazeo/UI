import type { IResponse } from "types/backend";
import instance from "services/axios.customize";

export const createVNPayPaymentAPI = (subscriptionId: number) => {
    const url_backend = `/api/v1/payments/vnpay/create/${subscriptionId}`;
    return instance.post<IResponse<{ paymentUrl: string }>>(url_backend);
}

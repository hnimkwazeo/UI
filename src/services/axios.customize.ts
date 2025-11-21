import axios, { AxiosError } from "axios";
import { useAuthStore } from "stores/auth.store";
import { refreshTokenAPI } from "services/auth.service";

const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
});

instance.interceptors.request.use(
    (config) => {
        if (config.url?.indexOf('/auth/refresh') === -1) {
            const { accessToken } = useAuthStore.getState();
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: any) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

instance.interceptors.response.use(
    (response) => {
        if (response.data && response.data.data) return response.data;
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return instance(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const res = await refreshTokenAPI();
                const newAccessToken = res.data.accessToken;
                const user = res.data.user;

                useAuthStore.getState().setAccessToken(newAccessToken);
                useAuthStore.getState().setUser(user);

                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                processQueue(null, newAccessToken);

                return instance(originalRequest);

            } catch (err) {
                processQueue(err as Error, null);
                useAuthStore.getState().logout();

                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default instance;

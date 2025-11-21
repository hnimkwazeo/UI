import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { IUser } from 'types/user.type';
import { logoutAPI } from 'services/auth.service';

interface AuthState {
    isAuthenticated: boolean;
    user: IUser | null;
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
    setUser: (user: IUser | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            user: null,
            accessToken: null,
            setAccessToken: (token) => set({ accessToken: token, isAuthenticated: !!token }),
            setUser: (user) => set({ user }),
            logout: async () => {
                try {
                    await logoutAPI();
                } catch (error) {
                    console.error("Logout API call failed, but clearing client state anyway.", error);
                } finally {
                    set({ isAuthenticated: false, accessToken: null, user: null });
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ isAuthenticated: state.isAuthenticated, accessToken: state.accessToken, user: state.user }),
        }
    )
);
import { App, ConfigProvider, theme } from 'antd';
import { useThemeStore } from 'stores/theme.store';

const ThemeProviderWrapper = ({ children }: { children: React.ReactNode }) => {
    const { theme: currentTheme } = useThemeStore();

    return (
        <ConfigProvider
            theme={{
                algorithm: currentTheme === 'dark'
                    ? theme.darkAlgorithm
                    : theme.defaultAlgorithm,

                token: {
                    colorPrimary: '#0077FF',
                    colorSuccess: '#00BE1D',
                    colorError: '#CE0000',

                    fontFamily: "'Reddit Sans', sans-serif",
                },
                components: {
                    Button: {
                        fontFamily: "'Reddit Sans Condensed', sans-serif",
                        fontWeight: 'bold',
                    },
                    Input: {
                        fontFamily: "'Reddit Sans', sans-serif",
                    },
                    Select: {
                        fontFamily: "'Reddit Sans', sans-serif",
                    }
                }
            }}
        >
            <App>
                {children}
            </App>
        </ConfigProvider>
    );
};

export default ThemeProviderWrapper;

import { Button } from 'antd';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { useThemeStore } from 'stores/theme.store';

const ThemeSwitcher = () => {
    const { theme, toggleTheme } = useThemeStore();

    return (
        <Button
            type="text"
            size="large"
            icon={theme === 'light' ? <MoonOutlined /> : <SunOutlined />}
            onClick={toggleTheme}
        />
    );
};

export default ThemeSwitcher;

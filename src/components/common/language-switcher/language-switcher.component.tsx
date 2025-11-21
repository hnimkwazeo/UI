import { Button, Dropdown, Space } from 'antd';
import type { MenuProps } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const handleLanguageChange = (lng: 'en' | 'vi') => {
        i18n.changeLanguage(lng);
    };

    const items: MenuProps['items'] = [
        {
            key: 'en',
            label: 'English',
            onClick: () => handleLanguageChange('en'),
            disabled: i18n.language === 'en',
        },
        {
            key: 'vi',
            label: 'Tiếng Việt',
            onClick: () => handleLanguageChange('vi'),
            disabled: i18n.language === 'vi',
        },
    ];

    return (
        <Dropdown menu={{ items }}>
            <Button type="text" size="large">
                <Space>
                    <GlobalOutlined />
                    {i18n.language === 'vi' ? 'VI' : 'EN'}
                </Space>
            </Button>
        </Dropdown>
    );
};

export default LanguageSwitcher;

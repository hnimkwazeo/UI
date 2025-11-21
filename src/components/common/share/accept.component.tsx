import { useAuthStore } from 'stores/auth.store';
import type { IPermission } from 'types/permission.type';
import { Badge, Tooltip } from 'antd';
import { CrownFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';

interface AcceptProps {
    apiPath: string;
    method: IPermission['method'];
    children: React.ReactElement;
    hide?: boolean;

    promptTitle?: string;
    promptDescription?: string;
    promptButtonUrl?: string;
}

const Accept = (
    { apiPath, method, children,
        hide = false,
        promptTitle = 'You don\'t have permission',
        promptDescription = 'Please upgrade your account',
        promptButtonUrl = '/store'
    }: AcceptProps) => {
    const { user } = useAuthStore();
    const permissions = user?.role.permissions || [];

    const hasPermission = permissions.some(
        p => p.apiPath === apiPath && p.method === method
    );

    if (hasPermission) {
        return children;
    }

    if (hide) {
        return <></>;
    }

    return (
        <Tooltip title={<><b>{promptTitle}</b><br />{promptDescription}</>} color='#FFD14E'>
            <Link to={promptButtonUrl}>
                <Badge count={<CrownFilled style={{ color: '#fadb14', fontSize: 18 }} />}>
                    {children}
                </Badge>
            </Link>
        </Tooltip>
    );
};

export default Accept;

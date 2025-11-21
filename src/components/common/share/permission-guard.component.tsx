import { useAuthStore } from 'stores/auth.store';
import type { IPermission } from 'types/permission.type';
import ForbiddenPage from 'pages/error/403.page';

interface PermissionGuardProps {
    apiPath: string;
    method: IPermission['method'];
    children: React.ReactElement;
}

const PermissionGuard = ({ apiPath, method, children }: PermissionGuardProps) => {
    const { user } = useAuthStore();
    const permissions = user?.role.permissions || [];

    const hasPermission = permissions.some(
        p => p.apiPath === apiPath && p.method === method
    );

    if (hasPermission) {
        return children;
    }

    return <ForbiddenPage />;
};

export default PermissionGuard;

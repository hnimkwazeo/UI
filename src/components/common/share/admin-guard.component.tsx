import { useAuthStore } from 'stores/auth.store';
import ForbiddenPage from 'pages/error/403.page';

const AdminGuard = ({ children }: { children: React.ReactElement }) => {
    const { user } = useAuthStore();
    const role = user?.role.name;

    if (role === 'ADMIN') {
        return <>{children}</>;
    }

    return <ForbiddenPage />;
};

export default AdminGuard;

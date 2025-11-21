import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import Logo from 'assets/images/logo.png';

const ForbiddenPage = () => {
    const navigate = useNavigate();
    return (
        <Result
            icon={<img src={Logo} alt="logo" />}
            title={<h1>403 Forbidden</h1>}
            subTitle="Sorry, you are not authorized to access this page."
            extra={<Button color="default" variant="outlined" onClick={() => navigate(-1)}>Go Back</Button>}
        />
    );
};

export default ForbiddenPage;
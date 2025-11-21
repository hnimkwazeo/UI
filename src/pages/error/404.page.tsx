import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import Logo from 'assets/images/logo.png';

const NotFoundPage = () => {
    const navigate = useNavigate();
    return (
        <Result
            icon={<img src={Logo} alt="logo" />}
            title={<h1>404 Not Found</h1>}
            subTitle="Sorry, the page you visited does not exist."
            extra={<Button color="default" variant="outlined" onClick={() => navigate(-1)}>Go Back</Button>}
        />
    );
};

export default NotFoundPage;

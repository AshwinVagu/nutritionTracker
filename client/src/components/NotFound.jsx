import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';

// Functional component for displaying a "Not Found" page
const NotFound = () => {
    // Rendering the JSX structure for the NotFound component
    return (
        <Result
            // Set the status, title, and subTitle for the Result component
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            // Provide an extra action with a Link to navigate back home
            extra={<Link to="/dashboard"><Button type="primary">Back Home</Button></Link>}
        />
    );
}

export { NotFound }
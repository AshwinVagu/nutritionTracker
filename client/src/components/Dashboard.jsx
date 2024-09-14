import { Header, AddConsumption, DailyProgress, Sidebar } from '../components';
import { Navigate } from 'react-router-dom';
import { ETLUpload } from '../components';
import { useSelector } from 'react-redux';
import "../styles/Dashboard.scss"

// Functional component for the main Dashboard
const Dashboard = () => {
    const user = useSelector(state => state.user)
    // Render the Dashboard layout
    return (
        user?.is_admin ? <ETLUpload /> :
            <div>
                {/* Render the Header component */}
                <Header />
                {/* Main container for the Dashboard */}
                <div className="dashboard-container">
                    {/* Render the Sidebar component */}
                    <Sidebar />
                    {/* Body of the Dashboard */}
                    <div className="dashboard-body">
                        {/* Container for displaying daily progress analytics */}
                        <div className='progress-container'>
                            {/* Render the DailyProgress component */}
                            <DailyProgress />
                        </div>
                        {/* Render the AddConsumption component */}
                        <AddConsumption />
                    </div>
                </div>
            </div>
    );
}


export { Dashboard };
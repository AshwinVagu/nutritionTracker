import React from 'react';
import { Progress, Space } from 'antd';
import "../styles/MonthlyProgress.scss";

// Functional component for displaying monthly progress
const MonthlyProgress = () => {
    // Rendering the JSX structure for the MonthlyProgress component
    return <div className='monthly-progress-container'>
         {/* Container for the monthly progress component */}
        <div>
             {/* Ant Design Progress component with circle type*/}
            <Progress type="circle" size={200} percent={75} />
            <div>Monthly Progress</div>
        </div>
    </div>
}

export { MonthlyProgress }
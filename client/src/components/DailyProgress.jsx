import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Progress, Space } from 'antd';
import "../styles/DailyProgress.scss";
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from "recharts";
import axiosServer from '../services/api';
import moment from 'moment';

// Functional component for displaying daily progress analytics
const DailyProgress = () => {
    // Redux hooks for dispatching actions and accessing state
    const dispatch = useDispatch()
    const user = useSelector(state => state.user);

    // State variables for chart data, goals, and tracking records
    const [chartData, setChartData] = useState([]);
    const [goals, setGoals] = useState([]);
    const [tracks, setTracks] = useState([]);

    // Effect hook to initialize data fetching when the user changes
    useEffect(() => {
        const init = async () => {
            // Fetch goals and tracking records for the user
            await getGoalsForUser()
            await getTrackingRecords()
        }

        // Execute initialization if user is available
        if (user) init()
    }, [user])

    // Function to fetch goals for the user
    const getGoalsForUser = async () => {
        try {
            const response = await axiosServer.get(`/goals/get-goals/${user.id}`, {
                headers: {
                    Accept: 'application/json',
                }
            });
            if (response) {
                const { data } = response;
                setGoals(data)
            }
        } catch (error) {
            console.log('Error!', error);
        }
    }

    // Function to fetch tracking records for the user
    const getTrackingRecords = async () => {
        try {
            const response = await axiosServer.get(`/tracking-records/get-tracking-records/${user.id}`, {
                headers: {
                    Accept: 'application/json',
                }
            });
            if (response) {
                const { data } = response;
                setTracks(data)
            }
        } catch (error) {
            console.log('Error!', error);
        }
    };

     // Function to generate chart data based on goals and tracking records
    const generateChartData = () => {
        const processedData = [];

        // Iterate through each goal
        goals.forEach(goal => {
            // Filter tracks for the same day as the goal
            const filteredTracks = tracks.filter(track => {
                const trackDate = moment(track.consumption_time).format("MM/DD/YYYY");
                const goalDate = moment(track.start_date).format("MM/DD/YYYY");
                return trackDate === goalDate;
            });

            // Sum consumed calories for the day
            const consumedCalories = filteredTracks.reduce((total, track) => total + track.consumed_calories, 0);

            // Push goal and consumed data to chart data
            processedData.push({
                name: moment(goal?.start_date).format("MM/DD/YYYY"),
                goal: parseInt(goal.calorie_count), // Convert string to integer
                consumed: consumedCalories
            });
        });

        // Set the processed data to the chartData state
        setChartData(processedData);
    };

    // Effect hook to regenerate chart data when goals or tracking records change
    useEffect(() => {
        generateChartData();
    }, [goals, tracks]);

    // Render the component with weekly analytics bar chart
    return <div className='daily-progress-container'>
        <h3>Weekly Analytics</h3>
        <div className="bar-chart-container">
            {/* Recharts BarChart component */}
            <BarChart width={1000} height={350} data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {/* Bars representing goal and consumed calories */}
                <Bar dataKey="goal" fill="#8884d8" />
                <Bar dataKey="consumed" fill="#82ca9d" />
            </BarChart>
        </div>
    </div>
}

export { DailyProgress }
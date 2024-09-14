import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Header, Sidebar } from "../components"
import { Input, message, Button, Table, Modal } from 'antd';
import axiosServer from '../services/api';
import moment from 'moment';
import { setGoals } from '../store';
import "../styles/Goals.scss";

// Functional component for managing user goals
const Goals = () => {
    // Redux hooks for dispatching actions and accessing state
    const dispatch = useDispatch()
    const user = useSelector(state => state.user);

    const goal_calories = [500, 1000, 2000]

    // State variables for message API, modal visibility, input values, and goal data
    const [messageApi, contextHolder] = message.useMessage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [calories, setCalories] = useState('');
    const [customCalories, setCustomCalories] = useState('');
    const [goals, setGoals] = useState([])
    const [editGoalObj, setEditGoalObj] = useState(null)
    const [editGoalCalories, setEditGoalCalories] = useState(null)

    // Effect hook to fetch user goals when the user changes
    useEffect(() => {
        if (user) {
            getGoalsForUser()
        }
    }, [user]);

    // Function to handle goal deletion
    const handleDelete = (record) => {
        axiosServer.delete(`/goals/delete-goal/${record.id}`)
            .then(() => {
                getGoalsForUser();
            })
            .catch((error) => {
                console.log("Error!", error);
            });
    };

    // Function to fetch goals for the current user
    const getGoalsForUser = async () => {
        try {
            const response = await axiosServer.get(`/goals/get-goals/${user.id}`, {
                headers: {
                    Accept: 'application/json',
                }
            });
            if (response) {
                const { data } = response;
                // Dispatch goals to Redux store
                dispatch(setGoals(data))
                // Update local state with goals data
                setGoals(data)
            }
        } catch (error) {
            console.log('Error!', error);
        }
    }

    // Function to add a new goal
    const addGoal = (cal) => {
        const submitObj = {
            'calorie_count': parseInt(cal),
            'start_date': new Date(),
            'end_date': new Date(),
            'user_id': user.id
        }
        axiosServer.post('/goals/add-goal', submitObj).then((data) => {
            // Display success message
            messageApi.open({
                type: 'success',
                content: 'New goal has been created successfully',
            });
            // Reset custom calories input and fetch updated goals
            setCustomCalories('')
            getGoalsForUser()
        }).catch((error) => {
            console.log("Error!", error)
        });
    }

    // Function to handle Enter key press for custom calories input
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            // Set calories state and add a new goal
            setCalories(customCalories)
            addGoal(customCalories)
        }
    };

    // Function to handle click on predefined calorie cards
    const onCalorieCardClick = (goal) => {
        // Set calories state and add a new goal
        setCalories(goal)
        addGoal(goal)
    }

    // Table columns configuration for displaying goals history
    const columns = [
        {
            title: 'Date',
            dataIndex: 'start_date',
            key: 'start_date',
            render: (text) => <div>{moment(text).format("MM/DD/YYYY")}</div>,
        },
        {
            title: 'Calorie count',
            dataIndex: 'calorie_count',
            key: 'calorie_count',
            render: (text) => <div>{text}</div>,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <div style={{ display: 'flex', gap: 5 }}>
                    <Button type="primary" onClick={() => {
                        setEditGoalObj(record)
                        setEditGoalCalories(record.calorie_count)
                        setIsModalOpen(true)
                    }}>
                        Edit
                    </Button>
                    <Button type="primary" onClick={() => handleDelete(record)} danger>
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    // Event handler for "Edit Goal" modal OK button
    const handleOk = () => {
        updateGoal(editGoalCalories)
    };

    // Event handler for "Edit Goal" modal Cancel button
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // Function to update an existing goal
    const updateGoal = (updatedCalories) => {
        const updatedGoal = {
            'calorie_count': updatedCalories,
            'start_date': editGoalObj.start_date,
            'end_date': editGoalObj.end_date,
            'user_id': user.id,
            'id': editGoalObj.id
        }

        axiosServer.put(`/goals/update-goal`, updatedGoal)
            .then(() => {
                // Display success message
                messageApi.open({
                    type: 'success',
                    content: 'Goal updated successfully',
                });
                // Close the modal and fetch updated goals
                setIsModalOpen(false);
                getGoalsForUser();
            })
            .catch((error) => {
                console.log("Error!", error);
            });
    };

    // Render the Goals component
    return (
        <div>
            {/* Display Ant Design message component */}
            {contextHolder}
            {/* Render the Header component */}
            <Header />
             {/* Main container for the Goals component */}
            <div className="goals-container">
                {/* Render the Sidebar component */}
                <Sidebar />
                 {/* Body of the Goals component */}
                <div className="goals-body">
                    {/* Container for setting a goal for the day */}
                    <div className="goal-for-day">
                        <h3>Set Goal for the day (Calories)</h3>
                         {/* Input container for predefined and custom calories */}
                        <div className='goal-input'>
                            {/* Display predefined calorie cards */}
                            {goal_calories.map(goal => (
                                <div onClick={() => onCalorieCardClick(goal)} className="defined-goal">{goal}</div>
                            ))}
                            {/* Input for entering custom calories */}
                            <Input value={customCalories} className="custom-input" type="number" placeholder='Custom' onChange={(e) => setCustomCalories(e.target.value)} onKeyDown={handleKeyPress} />
                        </div>
                    </div>
                    {/* Container for displaying goals history */}
                    <div className="past-goals">
                        <h3>Goals history</h3>
                         {/* Display a table with columns for date, calorie count, and actions */}
                        <Table columns={columns} dataSource={goals} pagination={false} />
                    </div>
                </div>
            </div>
            {/* Modal for editing a goal */}
            <Modal title="Edit Goal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText="Update">
                {/* Input for editing the calorie count */}
                <p className='modal-label'>Calorie:</p>
                <Input value={editGoalCalories} type="number" placeholder="Edit Calorie Count" onChange={(e) => setEditGoalCalories(e.target.value)} />
            </Modal>
        </div>
    )
}

export { Goals }
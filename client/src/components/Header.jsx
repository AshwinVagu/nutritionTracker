import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import "../styles/Header.scss";
import { DownOutlined, SmileOutlined, UserOutlined, PoweroffOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';
import { AiOutlineMenu } from "react-icons/ai";
import { auth } from '../config/firebaseConfig';
import { signOut } from "firebase/auth";
import { addUser, setCurrentRoute } from '../store';


// Functional component Header to display the universal header in the application
const Header = () => {
    const dispatch = useDispatch()
    // Creating a navigate function using the useNavigate hook
    const navigate = useNavigate();

    // Callback function to handle the profile icon click event
    const onProfileClick = () => {
        // Navigating to the "/profile" route
        navigate("/profile")
    }

    // Callback function to handle the logout event
    const onLogout = async () => {
        // Sign out the user using Firebase authentication
        await signOut(auth);

        // Dispatch actions to update Redux store state
        dispatch(addUser(null));
        dispatch(setCurrentRoute("/"));

        // Navigate to the home ("/") route
        navigate("/")
    };

    // Array of items for the dropdown menu, each item with a key, label, icon, and onClick function
    const items = [
        {
            key: '1',
            label: "Logout",
            icon: <PoweroffOutlined />,
            onClick: onLogout
        }
    ];

    // Rendering the JSX structure for the Header component
    return (
        <div className="navbar-container">
            {/* Logo and app name in the header */}
            <div className="navbar-logo">
                <img src="logo.svg" className="headerImage"alt="header-logo"></img>
            </div>

            {/* Options in the header, including the profile icon */}
            <div className="navbar-options">
                <UserOutlined onClick={onProfileClick} />
                {/* Dropdown menu with logout option */}
                <Dropdown
                    className="profile-dropdown"
                    menu={{
                        items,
                    }}
                >
                    {/* Button triggering the dropdown menu */}
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            <DownOutlined />
                        </Space>
                    </a>
                </Dropdown>
            </div>
        </div>
    )
}

export { Header }
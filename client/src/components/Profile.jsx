import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../styles/Profile.scss';
import { Header } from './Header';
import myImage from '../user.svg';
import { Sidebar } from './Sidebar';

// Functional component for displaying user profile information
const Profile = () => {
    // Access user data from the Redux store using the useSelector hook
    const user = useSelector(state => state.user);

    // JSX structure for the Profile component
    return (
        // Check if user data is available, then render the profile information
        user ?
            <>
                {/* Render the Header component */}
                <Header />
                
                {/* Container for the profile page with Header, Sidebar, and user information */}
                <div className="profile-container">
                    {/* Render the Sidebar component */}
                    <Sidebar className="profile-sidebar"/>

                    {/* Display the user avatar image */}
                    <img className="profileImage" src={myImage} alt="user-profile"></img>
                    
                    {/* Container for user profile information */}
                    <div className="profileContent">
                        <h1 className="profileLabel">User Profile</h1>
                         {/* Display user information*/}
                        <p className="profile-text"> <span className="blackText">Profile Name: </span><span className="bluetext">{user.first_name} {user.last_name}</span></p>
                        <p className="profile-text"> <span className="blackText">Username:  </span><span className="bluetext">{user.email} </span></p>
                        <p className="profile-text"> <span className="blackText">Height: </span><span className="bluetext">{user.height} Inches</span></p>
                        <p className="profile-text"> <span className="blackText">Weight: </span><span className="bluetext">{user.weight} cms</span></p>
                        <p className="profile-text"> <span className="blackText">Phone: </span><span className="bluetext">{user.phone}</span> </p>
                        <p className="profile-text"> <span className="blackText">Current BMI: </span><span className="bluetext">{(user.weight/((user.height * 0.01) ** 2)).toFixed(2)} kg/m2</span> </p>
                    </div>
                </div>
            </>
            : ""
    );
}

export { Profile };
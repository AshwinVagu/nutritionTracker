import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { GoGoal } from "react-icons/go";
import { GiCalculator } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";
import { MdDashboard } from "react-icons/md";
import { setCurrentRoute } from '../store';
import "../styles/Sidebar.scss";
import { Profile } from './Profile';

// Sidebar component responsible for rendering navigation links
const Sidebar = () => {
    // Sidebar navigation items with their corresponding routes and icons
    const sidebarItems = [
        {
            name: "Dashboard",
            routeTo: "/dashboard",
            icon: <MdDashboard />
        },
        {
            name: "Goals",
            routeTo: "/goals",
            icon: <GoGoal />
        },
        {
            name: "BMI Calculator",
            routeTo: "/bmi",
            icon: <GiCalculator />
        },
        {
            name: " User Profile",
            routeTo: "/profile",
            icon: <CgProfile />
        },
    ]
    const user = useSelector(state => state.user)
    // Redux dispatch function
    const dispatch = useDispatch();

    // Get the current route from Redux store
    const currentRoute = useSelector(state => state.currentRoute);
    const [sbItems, setSbItems] = useState([])

    // UseEffect to update the current route when the component mounts or the window pathname changes
    useEffect(() => {
        if (window.location.pathname) {
            const currentPath = window.location.pathname;
            dispatch(setCurrentRoute(currentPath))
        }
    }, [window.location.pathname]);


    useEffect(() => {
        if (user) {
            const items = user.is_admin ? sidebarItems.filter(i => !["/goals", "/bmi"].includes(i.routeTo)) : sidebarItems
            setSbItems(items)
        }
    }, [user])

    // Rendering the JSX structure for the S
    return (
        <div className="sidebar-container">
            <div className="sidebar-menu">
                {sbItems?.length > 0 && sbItems.map(e => <Link to={e.routeTo} className={`sidebar-item ${e.routeTo == currentRoute ? "selected" : ""}`}>
                    {e.icon} <p>{e.name}</p>
                </Link>)}
            </div>
        </div>
    )
}

export { Sidebar }
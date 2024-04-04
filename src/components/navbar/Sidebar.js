import React from "react";
import { slide as Menu } from 'react-burger-menu';
import { Link } from 'react-router-dom';
import { userStore } from "../../stores/UserStore";
import './Sidebar.css';


const Sidebar = () => {
    const { role, username } = userStore(state => state);
    
    return (
        <Menu>
            <Link className="menu-item" to="/home">Home</Link>
            <Link className="menu-item" to={"/profile"}>Profile</Link>
            {(role === "PRODUCT_OWNER" || role === "SCRUM_MASTER") && (<Link className="menu-item" to="/user">User Managment</Link>)}
            {role === "PRODUCT_OWNER" && ( <Link className="menu-item" to="/categories">Task Categories</Link>)}
            {(role === "PRODUCT_OWNER" || role === "SCRUM_MASTER") && (<Link className="menu-item" to="/recycle">Recicle Bin</Link>)}
        </Menu>
    );
};

export default Sidebar;
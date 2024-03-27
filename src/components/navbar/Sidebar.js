import React from "react";
import { slide as Menu } from 'react-burger-menu';
import { userStore } from "../../stores/UserStore";
import './Sidebar.css';

const Sidebar = () => {
    const { role } = userStore(state => state);
    return (
        // Different itens of the Sidebar
        <Menu>
            <a className="menu-item" href="/home">Home</a>
            <a className="menu-item" href="/profile">Profile</a>
            {(role === "PRODUCT_OWNER" || role === "SCRUM_MASTER") && (<a className="menu-item" href="/user">User Managment</a>)}
            {role === "PRODUCT_OWNER" && ( <a className="menu-item" href="/categories">Task Categories</a>)}
            {(role === "PRODUCT_OWNER" || role === "SCRUM_MASTER") && (<a className="menu-item" href="/recycle">Recicle Bin</a>)}
        </Menu>
    );
};

export default Sidebar;

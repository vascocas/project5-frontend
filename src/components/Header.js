// Header.js
import React from "react";
import "./Header.css";
import { useNavigate, Link } from "react-router-dom";
import { userStore } from "../stores/UserStore";


const Header = () => {
  const { username, token, photo, updateUsername, updateToken, updatePhoto, setIsLoginPage } =
    userStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/project5-backend/rest/users/logout",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      updateUsername(""); // Clear username
      updateToken(""); // Clear token
      updatePhoto(""); // Clear photo
      setIsLoginPage(true); 
      navigate("/"); // Redirect to the root URL after successful logout
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <header>
      <div className="header-right">
      <Link className="welcome-message" to={`/profile`}>
          Welcome, <span className="user-name">{username}</span>
        </Link>
        {photo && <img className="user-photo" src={photo} alt="Profile" />}
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { baseURL } from "./Requests";
import "../index.css";
import "./ValidateUser.css";

function ValidateUser() {
  const navigate = useNavigate();
  const location = useLocation();

   // State for storing validation token, new password, and confirm password
   const [validationToken, setValidationToken] = useState("");
   const [newPassword, setNewPassword] = useState("");
   const [confirmNewPassword, setConfirmNewPassword] = useState("");

  useEffect(() => {
    // Extract token from URL and validate user when component mounts
    const searchParams = new URLSearchParams(location.search);
    const validationToken = searchParams.get("validationToken");
    if (validationToken) {
      setValidationToken(validationToken);
      validateNewUser(validationToken);
    }
  }, []);

  const validateNewUser = async (token) => {
    try {
      const response = await fetch(
        `${baseURL}users/validate/?validationToken=${encodeURIComponent(
          token
        )}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        // Display a success message
        alert("User validated successfully!");
      } else {
        // Display an error message if request fails
        alert("Unable to validate the user");
      }
    } catch (error) {
      console.error("Error validating user:", error);
    }
  };

  const handleCreatePassword = () => {
    // Check if passwords match
    if (newPassword !== confirmNewPassword) {
      alert("Passwords do not match");
      return;
    }

    // Call createPassword function with necessary data
    createPassword(validationToken, newPassword, confirmNewPassword);
  };

  const createPassword = async (validationToken, newPassword, confirmNewPassword
  ) => {
    // Check password length and strong password using regular expression
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{4,}$/;
    if (newPassword.length < 4 || !strongPasswordRegex.test(newPassword)) {
      if (newPassword.length < 4) {
        alert("Password must be at least 4 characters long");
      } else {
        alert(
          "Password must contain at least one uppercase letter, one lowercase letter and one number"
        );
      }
      return;
    }

    // Check if passwords match
    if (newPassword !== confirmNewPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const userData = {
        password: validationToken,
        newPass: newPassword,
        confirmPass: confirmNewPassword,
      };
      const requestBody = JSON.stringify(userData);
      const response = await fetch(`${baseURL}users/create/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: requestBody,
      });
      if (response.ok) {
        // Password updated successfully
        alert("Password created successfully!");
        navigate("/");
      } else {
        // Handle error
        alert("Failed to create password.");
      }
    } catch (error) {
      console.error("Error creating password:", error);
    }
  };

  return (
    <div>
      <div className="validation">
        <h2>Define your password</h2>
        <label htmlFor="newPassword">New Password:</label>
        <input
          type="password"
          id="firstNewPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <label htmlFor="confirmNewPassword">Confirm New Password:</label>
        <input
          type="password"
          id="firstConfirmPassword"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        />
        <div className="firstPassword-button">
          <button onClick={handleCreatePassword}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

export default ValidateUser;

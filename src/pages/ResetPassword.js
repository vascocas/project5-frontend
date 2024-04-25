import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { baseURL } from "./Requests";
import "../index.css";
import "./ResetPassword.css";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  // State for storing validation token, new password, and confirm password
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  useEffect(() => {
    // Extract token from URL
    const searchParams = new URLSearchParams(location.search);
    const resetToken = searchParams.get("resetToken");
    if (resetToken) {
      setResetToken(resetToken);
    }
  }, []);

  const handleResetPassword = () => {
    // Check if passwords match
    if (newPassword !== confirmNewPassword) {
      alert("Passwords do not match");
      return;
    }

    // Call recoverPassword function with necessary data
    recoverPassword(resetToken, newPassword, confirmNewPassword);
  };

  const recoverPassword = async (
    resetToken,
    newPassword,
    confirmNewPassword
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
        password: resetToken,
        newPass: newPassword,
        confirmPass: confirmNewPassword,
      };
      const requestBody = JSON.stringify(userData);

      const response = await fetch(
        `${baseURL}users/reset/?resetToken=${encodeURIComponent(resetToken)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
          body: requestBody,
        }
      );
      if (response.ok) {
        // Display a success message
        alert("New password defined successfully!");
        navigate("/");
      } else {
        // Display an error message if request fails
        alert("Something went wrong");
      }
    } catch (error) {
      console.error("Error validating user:", error);
    }
  };

  return (
    <div>
      <div className="recovery">
        <h2>Define your password</h2>
        <label htmlFor="newPassword">New Password:</label>
        <input
          type="password"
          id="resetNewPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <label htmlFor="confirmNewPassword">Confirm New Password:</label>
        <input
          type="password"
          id="resetConfirmPassword"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        />
        <div className="resetPassword-button">
          <button onClick={handleResetPassword}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;

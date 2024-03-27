import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userStore } from "../stores/UserStore";
import "./Login_Register.css";

function Login() {
  const { updateUsername, updateToken, updateRole, updatePhoto } = userStore();
  const [inputs, setInputs] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { username, password } = inputs;

    // Input validations
    if (!username.trim() || !password.trim()) {
      alert("Username and password cannot be empty.");
      return;
    }

    let message;

    try {
      const response = await fetch(
        "http://localhost:8080/project4vc/rest/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            username: username,
            password: password,
          },
        }
      );

      if (response.ok) {
        const loginDto = await response.json();
        // Update userStore
        updateUsername(loginDto.username);
        updateToken(loginDto.token);
        updateRole(loginDto.role);
        updatePhoto(loginDto.photo);
        console.log("Successful Login!");
        // Go to the Home page
        navigate("/home", { replace: true });
      } else {
        message = await response.text();
        alert(message);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert(message);
    }
  };

  return (
    <div className="Login" id="profile-outer-container">
      <div className="left-page-wrap"></div>
      <div className="page-wrap" id="login-page-wrap">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-fields">
            <label htmlFor="username">Enter your username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={inputs.username}
              onChange={handleChange}
            />

            <label htmlFor="password">Enter your password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={inputs.password}
              onChange={handleChange}
            />
          </div>
          <div className="register-button">
            <input type="submit" value="Login" />
          </div>
          <br />
          <br />
          <p>Don't have an account? Register here.</p>
        </form>
      </div>
      <div className="right-page-wrap"></div>
    </div>
  );
}

export default Login;

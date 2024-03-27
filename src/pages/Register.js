import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userStore } from "../stores/UserStore";
import "./Login_Register.css";
import "../App.css";

function Register() {
  const navigate = useNavigate();
  const { setIsLoginPage } = userStore();
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    photo: "",
  });

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const {
      username,
      password,
      confirmPassword,
      email,
      firstName,
      lastName,
      phone,
      photo,
    } = inputs;

    // Check for empty inputs
    if (!username || !password || !email || !firstName || !lastName || !phone) {
      alert("All fields are required");
      return;
    }

    // Check password length and strong password using regular expression
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{4,}$/;
    if (password.length < 4 || !strongPasswordRegex.test(password)) {
      if (password.length < 4) {
        alert("Password must be at least 4 characters long");
      } else {
        alert(
          "Password must contain at least one uppercase letter, one lowercase letter and one number"
        );
      }
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    let message;

    try {
      const response = await fetch(
        "http://localhost:8080/project4vc/rest/users/register",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
            email,
            firstName,
            lastName,
            phone,
            photo,
          }),
        }
      );
      if (response.ok) {
        message = await response.text();
        alert(message);
        navigate("/", { replace: true });
        setIsLoginPage(true);
      } else {
        message = await response.text();
        alert(message);
      }
    } catch (error) {
      alert(message);
      console.error("Error registering:", error);
    }
  };

  return (
    <div className="Register" id="register-outer-container">
      <div className="left-page-wrap"></div>
      <div className="page-wrap" id="register-page-wrap">
        <h1>Register</h1>
        <form id="register-form" onSubmit={handleSubmit}>
          <label>
            Enter your username:
            <input
              type="text"
              name="username"
              value={inputs.username}
              onChange={handleChange}
            />
          </label>
          <label>
            Enter your password:
            <input
              type="password"
              name="password"
              value={inputs.password}
              onChange={handleChange}
            />
            <span className="help-tip">
              Password must be at least 4 characters long and contain at least
              one uppercase letter, one lowercase letter, one number
            </span>
          </label>
          <label>
            Confirm your password:
            <input
              type="password"
              name="confirmPassword"
              value={inputs.confirmPassword}
              onChange={handleChange}
            />
          </label>
          <label>
            Enter your email:
            <input
              type="email"
              name="email"
              value={inputs.email}
              onChange={handleChange}
            />
            <span className="help-tip">
              We'll send your registration confirmation here
            </span>
          </label>
          <label>
            Enter your first name:
            <input
              type="text"
              name="firstName"
              value={inputs.firstName}
              onChange={handleChange}
            />
          </label>
          <label>
            Enter your last name:
            <input
              type="text"
              name="lastName"
              value={inputs.lastName}
              onChange={handleChange}
            />
          </label>
          <label>
            Enter your phone number:
            <input
              type="tel"
              name="phone"
              value={inputs.phone}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (
                  !/\d/.test(e.key) &&
                  e.key !== "Backspace" &&
                  e.key !== "Delete"
                ) {
                  e.preventDefault();
                  alert("Please enter only numeric characters.");
                }
              }}
            />
            <span className="help-tip">Format: XXXXXXXXX</span>
          </label>
          <label>
            Enter your photo URL:
            <input
              type="text"
              name="photo"
              value={inputs.photo}
              onChange={handleChange}
            />
            <span className="help-tip">
              Provide a URL to your profile picture
            </span>
          </label>
          <input type="submit" value="Register" />
        </form>
      </div>
      <div className="right-page-wrap"></div>
    </div>
  );
}

export default Register;

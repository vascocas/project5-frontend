import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userStore } from "../stores/UserStore";
import { baseURL } from "./Requests";
import "./Login_Register.css";
import "../App.css";

function Register() {
  const navigate = useNavigate();
  const { setIsLoginPage } = userStore();
  const [inputs, setInputs] = useState({
    username: "",
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
      email,
      firstName,
      lastName,
      phone,
      photo,
    } = inputs;

    // Check for empty inputs
    if (!username || !email || !firstName || !lastName || !phone) {
      alert("All fields are required");
      return;
    }
    
    let message;
    try {
      const response = await fetch(
        `${baseURL}users/register`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
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
            Enter your email:
            <input
              type="email"
              name="email"
              value={inputs.email}
              onChange={handleChange}
            />
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
          </label>
          <label>
            Enter your photo URL:
            <input
              type="text"
              name="photo"
              value={inputs.photo}
              onChange={handleChange}
            />
          </label>
          <input type="submit" value="Register" />
        </form>
      </div>
      <div className="right-page-wrap"></div>
    </div>
  );
}

export default Register;

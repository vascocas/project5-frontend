import React, { useState } from "react";
import { userStore } from "../../stores/UserStore";
import { baseURL } from "../../pages/Requests";
import "../../pages/UserManagement.css";

function AddUserForm() {
  const { token, users, setUsers } = userStore();
  const [message, setMessage] = useState("");
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    photo: "",
    role: "",
  });

  // Handle input change
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
  };

  const handleAddUser = async () => {
    try {
      // Clear previous error message
      setMessage("");
      // Validate form fields
      if (
        !inputs.username ||
        !inputs.email ||
        !inputs.firstName ||
        !inputs.lastName ||
        !inputs.phone ||
        !inputs.role
      ) {
        setMessage("All fields are required");
        return;
      }

      // Regular expression for email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(inputs.email)) {
        setMessage("Please enter valid email format");
        return;
      }

      // Phone number validation
      const phoneRegex = /^\d+$/;
      if (!phoneRegex.test(inputs.phone)) {
        setMessage("Please enter only numeric characters for the phone number");
        return;
      }

      const requestBody = JSON.stringify({
        username: inputs.username,
        email: inputs.email,
        firstName: inputs.firstName,
        lastName: inputs.lastName,
        phone: inputs.phone,
        photo: inputs.photo,
        role: inputs.role,
      });

      const response = await fetch(`${baseURL}users/createUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: requestBody,
      });
      if (response.ok) {
        const newUser = await response.json();
        setUsers([...users, newUser]);
        alert("User added successfully!");
        // Clear input fields after successful addition
        setInputs({
          username: "",
          email: "",
          firstName: "",
          lastName: "",
          phone: "",
          photo: "",
          role: "",
        });
      } else {
        // Handle error response
        const errorMessage = "Unauthorized or invalid input fields";
        setMessage(errorMessage);
        console.log(errorMessage);
      }
    } catch (error) {
      console.log(error.message); // Set error message
    }
  };

  return (
    <div className="add-user-form">
      <input
        type="text"
        placeholder="Username"
        name="username"
        value={inputs.username}
        onChange={handleChange}
      />
      <input
        type="email"
        placeholder="Email"
        name="email"
        value={inputs.email}
        onChange={handleChange}
      />
      <input
        type="text"
        placeholder="First Name"
        name="firstName"
        value={inputs.firstName}
        onChange={handleChange}
      />
      <input
        type="text"
        placeholder="Last Name"
        name="lastName"
        value={inputs.lastName}
        onChange={handleChange}
      />
      <input
        type="tel"
        placeholder="Phone"
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
      <input
        type="text"
        placeholder="Photo (Optional)"
        name="photo"
        value={inputs.photo}
        onChange={handleChange}
      />
      <select name="role" value={inputs.role} onChange={handleChange}>
        <option value="">Select Role</option>
        <option value="DEVELOPER">Developer</option>
        <option value="SCRUM_MASTER">Scrum Master</option>
        <option value="PRODUCT_OWNER">Product Owner</option>
      </select>
      <div className="add-button-warning">
        <button id="addUserButton" onClick={handleAddUser}>
          Add User
        </button>
        <p id="warningMessage1">{message}</p>
      </div>
    </div>
  );
}
export default AddUserForm;

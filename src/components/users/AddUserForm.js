import React, { useState } from "react";
import { userStore } from "../../stores/UserStore";
import "../../pages/UserManagement.css";

function AddUserForm() {
  const { token, users, setUsers } = userStore();
  const [message, setMessage] = useState("");
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
    confirmPassword: "",
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
        !inputs.password ||
        !inputs.email ||
        !inputs.firstName ||
        !inputs.lastName ||
        !inputs.phone
      ) {
        setMessage("All fields are required");
        return;
      }

      // Check password length and strong password using regular expression
      const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{4,}$/;
      if (
        inputs.password.length < 4 ||
        !strongPasswordRegex.test(inputs.password)
      ) {
        if (inputs.password.length < 4) {
          alert("Password must be at least 4 characters long");
        } else {
          alert(
            "Password must contain at least one uppercase letter, one lowercase letter and one number"
          );
        }
        return;
      }

      // Check if passwords match
      if (inputs.password !== inputs.confirmPassword) {
        setMessage("Passwords do not match");
        return;
      }
      // Check if role is empty
      if (!inputs.role) {
        setMessage("No role selected");
      }
      const requestBody = JSON.stringify({
        username: inputs.username,
        password: inputs.password,
        email: inputs.email,
        firstName: inputs.firstName,
        lastName: inputs.lastName,
        phone: inputs.phone,
        photo: inputs.photo,
        role: inputs.role,
      });

      const response = await fetch(
        "http://localhost:8080/project4vc/rest/users/createUser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: requestBody,
        }
      );
      if (response.ok) {
        const newUser = await response.json();
        setUsers([...users, newUser]);
        alert("User added successfully!");
        // Clear input fields after successful addition
        setInputs({
          username: "",
          password: "",
          confirmPassword: "",
          email: "",
          firstName: "",
          lastName: "",
          phone: "",
          photo: "",
          role: "",
        });
      } else {
        // Handle error response
        const errorMessage = await response.text();
        console.error(errorMessage);
      }
    } catch (error) {
      setMessage(error.message); // Set error message
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
        type="password"
        placeholder="Password"
        name="password"
        value={inputs.password}
        onChange={handleChange}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        name="confirmPassword"
        value={inputs.confirmPassword}
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
      <button id="addUserButton" onClick={handleAddUser}>Add User</button>
      <p id="warningMessage1">{message}</p>
      </div>
    </div>
  );
}
export default AddUserForm;

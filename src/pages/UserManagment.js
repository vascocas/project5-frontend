import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/navbar/Sidebar";
import AddUserForm from "../components/users/AddUserForm";
import UpdateRoleModal from "../components/users/UpdateRoleModal";
import UsersProfile from "../components/users/UsersProfile";
import ChangePasswordModal from "../components/users/ChangePasswordModal";
import { userStore } from "../stores/UserStore";
import { useNavigate } from "react-router-dom";
import "../index.css";
import "./UserManagement.css";

const UserManagement = () => {
  const navigate = useNavigate();
  const { token, users, setUsers, usernames, setUsernames, updateRole } =
    userStore();
  const { role } = userStore((state) => state);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  const deletedMapping = {
    false: "Active",
    true: "Deleted",
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/project4vc/rest/users",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            token: token,
          },
        }
      );
      if (response.ok) {
        const usersArray = await response.json();
        setUsers(usersArray);
      } else {
        setUsers([]);
        throw new Error(`Failed to fetch users: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch users when the component mounts
  }, [token, setUsers]);

  const removeUser = async (userId) => {
    const confirmation = window.confirm("Confirm remove user?");
    if (!confirmation) {
      return; // User cancelled the operation
    }
    try {
      const response = await fetch(
        `http://localhost:8080/project4vc/rest/users/remove/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            token: token,
          },
        }
      );
      if (response.ok) {
        // Update users array
        setUsers(users.filter((user) => user.id !== userId));
        // Update usernames list
        setUsernames(usernames.filter((username) => username.id !== userId));
      } else {
        // Handle error
        alert("Failed to remove user.");
      }
    } catch (error) {
      console.error("Error removing user:", error);
    }
  };

  const handleUpdateRole = (userId) => {
    setSelectedUserId(userId); // Set the selected user ID
    setShowModal(true); // Show the modal
  };

  const handleConfirmUpdateRole = async (newRole) => {
    if (!newRole) {
      alert("Please select a role.");
      return;
    }

    try {
      const userData = {
        id: selectedUserId,
        role: newRole,
      };
      const requestBody = JSON.stringify(userData);
      const response = await fetch(
        `http://localhost:8080/project4vc/rest/users/role`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            token: token,
          },
          body: requestBody,
        }
      );
      if (response.ok) {
        fetchUsers();
        setShowModal(false); // Close the modal
      } else {
        // Handle error
        alert("Failed to update user role.");
      }
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const handleChangePassword = async (userId) => {
    setSelectedUserId(userId);
    setShowChangePasswordModal(true);
  };

  const handleConfirmChangePassword = async (
    selectedUserId,
    actualPassword,
    newPassword,
    confirmNewPassword
  ) => {
    try {
      const userData = {
        id: selectedUserId,
        password: actualPassword,
        newPass: newPassword,
        confirmPass: confirmNewPassword,
      };
      const requestBody = JSON.stringify(userData);
      const response = await fetch(
        `http://localhost:8080/project4vc/rest/users/othersPassword`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            token: token,
          },
          body: requestBody,
        }
      );
      if (response.ok) {
        // Password updated successfully
        alert("Password updated successfully!");
      } else {
        // Handle error
        alert("Failed to update password.");
      }
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };

  return (
    <div className="user-managment-page">
      <Header />
      <Sidebar
        pageWrapId={"user-managment-page-wrap"}
        outerContainerId={"managment-page"}
      />
      <div className="content">
        <div className="user-columns">
          {role === "PRODUCT_OWNER" && (
            <div className="add-user-column">
              <h3 id="addUserTitle">Add User</h3>
              <AddUserForm />
            </div>
          )}
          {role === "PRODUCT_OWNER" && (
            <div className="users-board">
              <h1 className="page-title">User Management</h1>
              <h3 id="usersTableTitle">Users List</h3>
              <table className="users-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Role</th>
                    <th>State</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.username}</td>
                      <td>{user.role}</td>
                      <td>{deletedMapping[user.deleted]}</td>
                      <td>
                        <div>
                          <button
                            className="users-table-button"
                            onClick={() => handleUpdateRole(user.id)}
                          >
                            Update Role
                          </button>
                          <button
                            className="users-table-button1"
                            onClick={() => handleChangePassword(user.id)}
                          >
                            Change Password
                          </button>
                          <button
                            className="users-table-button"
                            onClick={() => removeUser(user.id)}
                          >
                            Remove User
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <UpdateRoleModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleConfirmUpdateRole}
              />
              <ChangePasswordModal
                isOpen={showChangePasswordModal}
                onRequestClose={() => setShowChangePasswordModal(false)}
                onSubmit={handleConfirmChangePassword}
                selectedUserId={selectedUserId}
                title="Change Password"
              />
              <div className="homeMenu-button-container">
                <button
                  id="usersBackButton"
                  className="users-button"
                  onClick={() => navigate("/Home")}
                >
                  Back to Scrum Board
                </button>
              </div>
            </div>
          )}
          {(role === "PRODUCT_OWNER" || role === "SCRUM_MASTER") && (
            <div className="edit-user-column">
              <h3 id="usersProfileTitle">Consult Users Profile</h3>
              <UsersProfile />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;

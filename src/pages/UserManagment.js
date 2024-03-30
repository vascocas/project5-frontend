import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/navbar/Sidebar";
import AddUserForm from "../components/users/AddUserForm";
import UpdateRoleModal from "../components/users/UpdateRoleModal";
import UsersProfile from "../components/users/UsersProfile";
import ChangePasswordModal from "../components/users/ChangePasswordModal";
import { userStore } from "../stores/UserStore";
import { useNavigate } from "react-router-dom";
import { useTable, useFilters, usePagination } from 'react-table';
import "../index.css";
import "./UserManagement.css";

const UserManagement = () => {
  const navigate = useNavigate();
  const { token, users, setUsers, usernames, setUsernames } = userStore();
  const { role } = userStore((state) => state);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [tokenTimer, setTokenTimer] = useState(0);
  const [filterValue, setFilterValue] = useState('');
  

  const deletedMapping = {
    false: "Active",
    true: "Deleted",
  };

  const columns = React.useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "Username", accessor: "username" },
      { Header: "Role", accessor: "role" },
      { Header: "State", accessor: "deleted", Cell: ({ value }) => deletedMapping[value] },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div>
            <button className="users-table-button" onClick={() => handleUpdateRole(row.original.id)}>
              Update Role
            </button>
            <button className="users-table-button1" onClick={() => handleChangePassword(row.original.id)}>
              Change Password
            </button>
            <button className="users-table-button" onClick={() => removeUser(row.original.id)}>
              Remove User
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { pageIndex, pageSize },
    canPreviousPage,
    canNextPage,
    pageCount,
    nextPage,
    previousPage,
    setPageSize,
    setFilter,
  } = useTable(
    { columns, data: users },
    useFilters,
    usePagination
  );


  const fetchUsers = async (keyword = "") => {
    try {
      const response = await fetch(
        `http://localhost:8080/project5-backend/rest/users?keyword=${keyword}`,
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
    showTokenTimer(); // Fetch token timer when the component mounts
  }, [token, setUsers]);

  const removeUser = async (userId) => {
    const confirmation = window.confirm("Confirm remove user?");
    if (!confirmation) {
      return; // User cancelled the operation
    }
    try {
      const response = await fetch(
        `http://localhost:8080/project5-backend/rest/users/remove/${userId}`,
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
        `http://localhost:8080/project5-backend/rest/users/role`,
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
        `http://localhost:8080/project5-backend/rest/users/othersPassword`,
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

  const showTokenTimer = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/project5-backend/rest/users/tokenTimer",
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
        const sessionTimeout = await response.json();
        setTokenTimer(sessionTimeout.timer);
      } else {
        setTokenTimer(0);
        throw new Error(`Failed to fetch Token Timer: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching Token Timer:", error);
      setTokenTimer(0);
    }
  };

  const handleTokenTimerChange = (event) => {
    setTokenTimer(event.target.value); // Update token timer value in state
  };

  // Function to update token timer value
  const updateTokenTimer = async () => {
    try {
      const timerData = {
        timer: tokenTimer,
      };
      const requestBody = JSON.stringify(timerData);
      const response = await fetch(
        `http://localhost:8080/project5-backend/rest/users/tokenTimer`,
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
        // Token Timer updated successfully
        alert("Token Timer updated successfully!");
      } else {
        // Handle error
        alert("Failed to update Token Timer.");
      }
    } catch (error) {
      console.error("Error updating Token Timer:", error);
    }
  };

  const handleFilterApply = () => {
    setFilter([{ id: 'role', value: filterValue }]);
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
              <div>
                <input
                  value={filterValue}
                  placeholder="Filter by Role"
                  onChange={(e) => setFilterValue(e.target.value)}
                />
                <button onClick={handleFilterApply}>Search</button>
              </div>
              <table {...getTableProps()}>
                <thead>
                  {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {rows.map(row => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map(cell => (
                          <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div>
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                  {'<'}
                </button>{' '}
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                  {'>'}
                </button>{' '}
               <span>
                  Page{' '}
                  <strong>
                    {pageIndex + 1}</strong> of <strong>{pageCount}
                  </strong>{' '}
                </span>
                <select
                  value={pageSize}
                  onChange={e => {
                    setPageSize(Number(e.target.value));
                  }}
                >
                  {[10, 20].map(pageSize => (
                    <option key={pageSize} value={pageSize}>
                      Show {pageSize}
                    </option>
                  ))}
                </select>
              </div>
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
              <div>
                <label htmlFor="tokenTimer">Token Timer [m]: </label>
                <input
                  type="number"
                  id="tokenTimer"
                  value={tokenTimer}
                  onChange={handleTokenTimerChange}
                />
                <button onClick={updateTokenTimer}>Update Timer</button>
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

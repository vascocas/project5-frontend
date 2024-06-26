import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/navbar/Sidebar";
import AddUserForm from "../components/users/AddUserForm";
import UpdateRoleModal from "../components/users/UpdateRoleModal";
import UsersProfile from "../components/users/UsersProfile";
import MediaType from "../components/media/MediaType";
import { userStore } from "../stores/UserStore";
import { useNavigate } from "react-router-dom";
import { useTable, usePagination } from "react-table";
import { baseURL } from "./Requests";
import "../index.css";
import "./UserManagement.css";

const UserManagement = () => {
  const { token, users, setUsers, usernames, setUsernames, role } = userStore();
  const mediatype = userStore((state) => state.mediatype);
  const navigate = useNavigate();
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [tokenTimer, setTokenTimer] = useState(0);
  const [filterValue, setFilterValue] = useState("");
  const [orderValue, setOrderValue] = useState("ASC"); // Default order value
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Call MediaType component to handle media type detection
  MediaType();

  const columns = React.useMemo(
    () => [
      ...(mediatype.isMobile || mediatype.isLargeScreen
        ? []:[{ Header: "Id", accessor: "id" }]),
      { Header: "Username", accessor: "username" },
      ...(mediatype.isMobile || mediatype.isLargeScreen
        ? []
        : [{ Header: "Email", accessor: "email" }]),
      { Header: "Role", accessor: "role" },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div>
            <button
              className="users-table-button"
              onClick={() => handleUpdateRole(row.original.id)}
            >
              Update Role
            </button>
            <button
              className="users-table-button"
              onClick={() => removeUser(row.original.id)}
            >
              Remove User
            </button>
          </div>
        ),
      },
    ],
    [mediatype.isMobile, mediatype.isLargeScreen]
  );

  const roleOptions = ["DEVELOPER", "SCRUM_MASTER", "PRODUCT_OWNER"]; // Options for select dropdown

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { pageSize },
    setPageSize,
  } = useTable({ columns, data: users }, usePagination);

  const fetchUsers = async () => {
    try {
      let url;
      if (filterValue) {
        // If filter is defined, include the role parameter in the URL
        url = `${baseURL}users?role=${filterValue}&order=${orderValue}&page=${currentPage}&pageSize=${pageSize}`;
      } else {
        // If filter is not defined, exclude the role parameter from the URL
        url = `${baseURL}users?order=${orderValue}&page=${currentPage}&pageSize=${pageSize}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          token: token,
        },
      });
      if (response.ok) {
        const responseData = await response.json();

        // Extract data from the response
        const { currentPage, pageSize, totalPages, users } = responseData;
        // Update state with the extracted data
        setUsers(users);
        setTotalPages(totalPages);
        setPageSize(pageSize);
        setCurrentPage(currentPage);
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
    fetchUsers();
    showTokenTimer(); // Fetch token timer when the component mounts
  }, [pageSize, currentPage, filterValue, orderValue]);

  const handleRoleFilter = (e) => {
    setFilterValue(e.target.value); // Update the filter value when role selection changes
  };

  const handleOrderChange = (e) => {
    setOrderValue(e.target.value); // Update the order value when order selection changes
  };

  const isFirstPage = () => currentPage === 1;
  const isLastPage = () => currentPage === totalPages;

  const previousPage = () => {
    if (!isFirstPage()) {
      setPageSize(pageSize); // This line is to ensure the page size remains the same
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (!isLastPage()) {
      setPageSize(pageSize); // This line is to ensure the page size remains the same
      setCurrentPage(currentPage + 1);
    }
  };

  const removeUser = async (userId) => {
    const confirmation = window.confirm("Confirm remove user?");
    if (!confirmation) {
      return; // User cancelled the operation
    }
    try {
      const response = await fetch(`${baseURL}users/remove/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          token: token,
        },
      });
      if (response.ok) {
        // Update users array
        setUsers(users.filter((user) => user.id !== userId));
        // Update usernames list
        setUsernames(usernames.filter((username) => username.id !== userId));
        fetchUsers();
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
      const response = await fetch(`${baseURL}users/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          token: token,
        },
        body: requestBody,
      });
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

  const showTokenTimer = async () => {
    try {
      const response = await fetch(`${baseURL}users/tokenTimer`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          token: token,
        },
      });
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
      const response = await fetch(`${baseURL}users/tokenTimer`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          token: token,
        },
        body: requestBody,
      });
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

  const handleRowClick = (clickedUsername) => {
    // Navigate to the user's profile page with a unique URL
    navigate(`/profile/${clickedUsername}`);
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
                <select value={filterValue} onChange={handleRoleFilter}>
                  <option value="">Select Role</option>
                  {roleOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <select value={orderValue} onChange={handleOrderChange}>
                  <option value="ASC">Ascending</option>
                  <option value="DESC">Descending</option>
                </select>
              </div>
              <table className="users-table" {...getTableProps()}>
                <thead>
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th {...column.getHeaderProps()}>
                          {column.render("Header")}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {rows.map((row) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell, index) => (
                          <td
                            {...cell.getCellProps()}
                            onClick={() => {
                              // Check if the index is less than 4 (Only for columns: Id and Username)
                              if (index < 2) {
                                handleRowClick(row.original.username);
                              }
                            }}
                            style={{
                              cursor: index < 2 ? "pointer" : "default",
                            }}
                          >
                            {cell.render("Cell")}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div>
                <button onClick={previousPage} disabled={isFirstPage()}>
                  {"<"}
                </button>{" "}
                <button onClick={nextPage} disabled={isLastPage()}>
                  {">"}
                </button>{" "}
                <span>
                  Page <strong>{currentPage}</strong> of{" "}
                  <strong>{totalPages}</strong>{" "}
                </span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                  }}
                >
                  {[5, 10, 15].map((pageSize) => (
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

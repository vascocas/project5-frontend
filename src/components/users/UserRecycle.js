import React, { useEffect } from "react";
import { userStore } from "../../stores/UserStore";
import "../../pages/RecycleBin.css";

const UserRecycle = () => {
  const { deletedUsers, setDeletedUsers } = userStore();
  const { token } = userStore();

  useEffect(() => {
    const fetchDeletedUsers = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/project4vc/rest/users/deletedUsers",
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
          const arrayDeleted = await response.json();
          setDeletedUsers(arrayDeleted);
        } else {
          throw new Error(
            `Failed to fetch deleted users: ${await response.text()}`
          );
        }
      } catch (error) {
        console.error("Error fetching deleted users:", error);
      }
    };

    fetchDeletedUsers();
  }, [token, setDeletedUsers]);


  const removeUser = async (userId) => {
    const confirmation = window.confirm("Confirm delete user permanantly?");
    if (!confirmation) {
      return; // User cancelled the operation
    }
    try {
      const response = await fetch(
        `http://localhost:8080/project4vc/rest/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            token: token,
          },
        }
      );
      const message = await response.text();
      if (response.ok) {
        console.log("Sucesso: ", message);
        userStore.getState().removeDeletedUser(userId); // Update userStore
      } else {
        console.log(message);
      }
    } catch (error) {
      console.error("Error removing user:", error);
    }
  };

  return (
    <table className="table-recycle">
      <thead className="table-header-recycle">
        <tr>
          <th className="table-header-recycle">Id</th>
          <th className="table-header-recycle">Username</th>
          <th className="table-header-recycle">Actions</th>
        </tr>
      </thead>
      <tbody>
        {deletedUsers.map((user) => (
          <tr key={user.id}>
            <td className="table-row-recycle">{user.id}</td>
            <td className="table-row-recycle">{user.username}</td>
            <td>
              <button className="recycle-button" onClick={() => removeUser(user.id)}>Remove User</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserRecycle;

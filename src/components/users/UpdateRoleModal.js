import React, { useState } from "react";
import "../../pages/UserManagement.css";

const UpdateRoleModal = ({ show, onClose, onConfirm }) => {
  const [selectedRole, setSelectedRole] = useState("");

  if (!show) return null;

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  return (
    <div className="modal-container">
      <div className="modal-content">
        <h2>Update User Role</h2>
        <select value={selectedRole} onChange={handleRoleChange}>
          <option value="">Select Role</option>
          <option value="DEVELOPER">DEVELOPER</option>
          <option value="SCRUM_MASTER">SCRUM_MASTER</option>
          <option value="PRODUCT_OWNER">PRODUCT_OWNER</option>
        </select>
        <div className="modal-buttons">
          <button onClick={() => onConfirm(selectedRole)}>Confirm</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default UpdateRoleModal;

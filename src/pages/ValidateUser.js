import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { baseURL } from "./Requests";

function ValidateUser() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract token from URL and validate user when component mounts
    const searchParams = new URLSearchParams(location.search);
    const validationToken = searchParams.get("validationToken");
    if (validationToken) {
      validateUser(validationToken);
    }
  }, []);

  const validateUser = async (token) => {
    try {
      const response = await fetch(
        `${baseURL}users/validate/?validationToken=${encodeURIComponent(token)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        // Display a success message
        alert("User validated successfully!");
        navigate("/");
      } else {
        // Display an error message if request fails
        alert("Unable to validate the user");
      }
    } catch (error) {
      console.error("Error validating user:", error);
    }
  };

  return (
    <div className="validation">
      
    </div>
  );
}

export default ValidateUser;

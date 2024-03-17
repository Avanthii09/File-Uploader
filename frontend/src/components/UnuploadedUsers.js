import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import MyNavBarLogout from "./NavBarLogout";

const UnuploadedUsers = () => {
  const { quarter } = useParams();
  const [unuploadedUsers, setUnuploadedUsers] = useState([]);

  useEffect(() => {
    fetchUnuploadedUsers();
  }, [quarter]);

  const fetchUnuploadedUsers = async () => {
    try {
      const token = localStorage.getItem('my_app_token'); // Replace with your token logic

      const response = await axios.get(`http://127.0.0.1:8000/unuploaded_users/quarter${quarter}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      setUnuploadedUsers(response.data);
    } catch (error) {
      console.error("Error fetching unuploaded users:", error);
    }
  };

  const handleBack = () => {
    // Implement navigation back to the previous page
  };

  return (
    <div>
      <MyNavBarLogout />
      <h2>Unuploaded Users - Quarter {quarter}</h2>
      {unuploadedUsers.length > 0 ? (
        <div>
          <ul>
            {unuploadedUsers.map((user) => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <p>All users have uploaded</p>
        </div>
      )}
      <button onClick={handleBack}>Back</button>
    </div>
  );
};

export default UnuploadedUsers;

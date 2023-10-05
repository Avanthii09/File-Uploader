import React, { useState, useEffect } from "react";
import axios from "axios";
import MyNavBarLogout from "./NavBarLogout";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../styles/ModifyOrder.css"; // Import your CSS file

function ModifyOrder() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [newOrders, setNewOrders] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [responseMessage, setResponseMessage] = useState(""); // State to hold response message

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/display_users", {
        headers: {
          // Authorization and other headers if needed
          "Content-Type": "application/json",
        },
      });

      // Handle the response data
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };


  const handleOrderChange = (emailID, newOrder) => {
    setNewOrders((prevOrders) => ({
      ...prevOrders,
      [emailID]: newOrder,
    }));
  };

  const handleSubmit = async () => {
    try {
      const updatedOrders = users.map((user) => ({
        emailID: user.emailID,
        order: newOrders[user.emailID] || user.order,
      }));

      const response = await axios.put(
        "http://127.0.0.1:8000/update_users",
        updatedOrders,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data && response.data.message) {
        setSuccessMsg(response.data.message);
        setErrorMsg("");
        setResponseMessage("User details updated successfully"); // Set the response message
        fetchUsers();
      } else {
        setErrorMsg("Error updating orders. Please try again.");
        setSuccessMsg("");
      }
    } catch (error) {
      console.error("Error updating orders:", error);
      setErrorMsg("Error updating orders. Please try again.");
      setSuccessMsg("");
    }
  };

  return (
    <div>

      <div className="modify-order-container">
        <h3 className="modify-order-heading">Modify User Order</h3>
        <ul className="user-list-container">
          {users.map((user) => (
            <li key={user.emailID} className="user-list-item">
              <div className="user-details">
                <span className="user-email">{user.emailID}</span>
                <span className="user-role">{user.role}</span>
                <span className="user-section">{user.section}</span>
              </div>
              <input
                type="number"
                value={newOrders[user.emailID] || user.order}
                onChange={(e) =>
                  handleOrderChange(user.emailID, parseInt(e.target.value))
                }
                className="order-input"
              />
            </li>
          ))}
        </ul>

        <p className="modify-error-message">{errorMsg}</p>
        <p className="success-message">{successMsg}</p>
        {responseMessage && <p className="response-message">{responseMessage}</p>}
        <button className="submit-button" onClick={handleSubmit}>
          Update Orders
        </button>
      </div>
      <div >
        <Link className='backtoAdmin-link' to='/Admin'> Back to Admin </Link>
      </div>
    </div>
  );
}

export default ModifyOrder;


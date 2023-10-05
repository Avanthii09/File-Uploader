import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import '../styles/PendingList.css'

function MyPendingList() {
    const { quarter } = useParams();
    const [pendingUsers, setPendingUsers] = useState([]);
    const [isDownloadEnabled, setIsDownloadEnabled] = useState(false);

    useEffect(() => {
        const fetchPendingUsers = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/unuploaded_users/quarter${quarter}`);
                if (Array.isArray(response.data)) {
                    setPendingUsers(response.data);
                    setIsDownloadEnabled(response.data.length === 0);
                } else {
                    setPendingUsers([]);
                    setIsDownloadEnabled(true);
                }
            } catch (error) {
                console.error("Error fetching pending users:", error);
            }
        };

        fetchPendingUsers();
    }, [quarter]);

    const handleDownload = async () => {
        try {
            const token = localStorage.getItem('my_app_token'); // Replace 'my_app_token' with the actual name of your JWT token key

            // Set the request headers to include the JWT token
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json', // Set the content type if you are sending JSON data
            };

            const response = await axios.get(`http://127.0.0.1:8000/principal/download_pdf/quarter${quarter}`, {
                responseType: "blob", // Important: Set the response type to blob
            }, { headers });

            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `quarter${quarter}_merged_pdf.pdf`;
            link.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading PDF:", error);
        }
    };

    return (
        <div className="pending-list-container">
            <h2 className="pending-list-title">Pending List for Quarter {quarter}</h2>
            <div className="pending-users-list">
                {pendingUsers.length === 0 ? (
                    <p className="no-pending-users">All users have uploaded for this quarter.</p>
                ) : (
                    <ul>
                        {pendingUsers.map((user) => (
                            <li key={user.email}>
                                <span>{user.email}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="download">
                {isDownloadEnabled && (
                    <button
                        className="download-button"
                        onClick={handleDownload}
                    >
                        Download {`Quarter ${quarter}`}
                    </button>
                )}
                <Link className="backlink" to="/DownloadQuarters">  Back </Link>
            </div>
        </div>
    );
}

export default MyPendingList;

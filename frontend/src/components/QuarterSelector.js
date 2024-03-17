import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/QuarterSelector.css';
import MyNavBarLogout from "./NavBarLogout";


const quarterRanges = [
    { quarter: 1, months: "January - March" },
    { quarter: 2, months: "April - June" },
    { quarter: 3, months: "July - September" },
    { quarter: 4, months: "October - December" },
];

function MyQuarterSelector({ setIsLoggedIn, setUserRole, isLoggedIn }) {
    const navigate = useNavigate();
    const [quarterEndDates, setQuarterEndDates] = useState({});
    

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Months are zero-indexed
    const currentDay = currentDate.getDate();

    // useEffect(() => {
    //     fetchEndDates();
    // }, []);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/");
        } else {
            fetchEndDates(); // Only fetch end dates if the user is logged in
        }
    }, [isLoggedIn, navigate]);

    const handleLogout = async () => {
        // Clear local storage and update state

        localStorage.removeItem("accessToken");
        setIsLoggedIn(false);
        setUserRole("");

        // Wait for the state update to complete
        await Promise.resolve();

        // Navigate to the root ("/") route
        navigate("/");
    };

     // Redirect to homepage when not logged in
     if (!isLoggedIn) {
        navigate("/");
        return null; // Optionally, you can return null or a message indicating redirection.
    }

    const fetchEndDates = async () => {
        console.log("Fetching end dates...");
        try {
            const endDates = {};
            for (const { quarter } of quarterRanges) {
                const response = await axios.get(`http://127.0.0.1:8000/fetchEnddate/${quarter}`);
                if (response.status === 200) {
                    endDates[quarter] = response.data.enddate;
                }
            }
            console.log("Fetched end dates:", endDates);
            setQuarterEndDates(endDates);
        } catch (error) {
            console.error("Error fetching end dates:", error);
        }
    };

    const handleUploadClick = async (quarter) => {
        console.log("Upload button clicked for quarter", quarter);
        const selectedQuarterEndDate = quarterEndDates[quarter];
        console.log("Selected quarter end date:", selectedQuarterEndDate);
        if (selectedQuarterEndDate) {
            navigate(`/Upload`, { state: { selectedQuarter: quarter, endDate: selectedQuarterEndDate } });
        }
    };

    return (
        <div>
            <MyNavBarLogout handleLogout={handleLogout} />
            <div className="user-list">
                <h3> QUARTER SELECTOR </h3>
                <ul>
                    {quarterRanges.map(({ quarter, months }) => {
                        const selectedQuarterEndDate = quarterEndDates[quarter];
                        let isButtonDisabled = true;
                        let quarterEndDate = null;

                        if (selectedQuarterEndDate) {
                            const [year, month, day] = selectedQuarterEndDate.split("-").map(Number);
                            quarterEndDate = new Date(year, month - 1, day); // Months are zero-indexed in JavaScript

                            // Check if the current date is greater than the end of the quarter
                            isButtonDisabled = currentDate > quarterEndDate;
                        }

                        return (
                            <li key={quarter}>
                                <h5>
                                    QUARTER {quarter} ({months})
                                    <button
                                        className={`upload-button${quarter}`}
                                        onClick={() => handleUploadClick(quarter)}
                                        disabled={isButtonDisabled}
                                    >
                                        UPLOAD
                                    </button>
                                </h5>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

export default MyQuarterSelector;

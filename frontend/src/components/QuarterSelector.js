import React from "react";
import MyNavBarLogout from "./NavBarLogout";
import '../styles/QuarterSelector.css'; // Make sure to import your custom CSS
import { useNavigate } from "react-router-dom";
// import { useAuth } from "./AuthContext";
function MyQuarterSelector() {
    const navigate = useNavigate();
    // const { handleLogout } = useAuth();
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const lastDates = [
        { quarter: 1, month: 2, day: 5 },   // Quarter 1: March 5th
        { quarter: 2, month: 5, day: 5 },   // Quarter 2: June 5th
        { quarter: 3, month: 8, day: 5 },   // Quarter 3: September 5th
        { quarter: 4, month: 11, day: 5 },  // Quarter 4: December 5th
    ];

    const handleUploadClick = (quarter) => () => {
        const isCurrentQuarter = quarter === Math.floor((currentMonth + 1) / 3) + 1;

        if (isCurrentQuarter) {
            navigate(`/Uploader?quarter=${quarter}`);
        }
    };
    

    return (
        <div>
            <MyNavBarLogout />
            <div className="user-list">
                <h3> QUARTER SELECTOR </h3>
                <ul>
                    {lastDates.map(({ quarter, month, day }) => {
                        const isCurrentQuarter = quarter === Math.floor((currentMonth + 1) / 3) + 1;
                        const isFutureQuarter = currentMonth > 8 && quarter === 4;
                        return (
                            <li key={quarter}>
                                <h5>
                                    QUARTER {quarter} (
                                    {quarter === 1 && `January - March)`}
                                    {quarter === 2 && `April - June)`}
                                    {quarter === 3 && `July - September)`}
                                    {quarter === 4 && `October - December)`}
                                    <button
                                        className={`upload-button${quarter}`}
                                        onClick={handleUploadClick(quarter)}
                                        disabled={!isCurrentQuarter || isFutureQuarter}
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


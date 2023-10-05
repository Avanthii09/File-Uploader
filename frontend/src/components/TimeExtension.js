import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MyNavBarLogout from "./NavBarLogout";
import "../styles/TimeExtension.css";
import { Link } from "react-router-dom";

function MyTimeExtension() {
    const [extendedQuarter, setExtendedQuarter] = useState(null);
    const [selectedQuarter, setSelectedQuarter] = useState(null); // State to store selected quarter
    const navigate = useNavigate();

   
    const handleExtendClick = (quarter) => {
        setExtendedQuarter(quarter);
        console.log(quarter)
        navigate("/Extend", { state: { selectedQuarter: quarter } }); // Pass the selected quarter
    }
    

    const lastDates = [
        { quarter: 1, month: 2, day: 25 },
        { quarter: 2, month: 5, day: 25 },
        { quarter: 3, month: 8, day: 25 },
        { quarter: 4, month: 11, day: 25 },
    ];

    return (
        <div>
            <div className="timelist">
                <h3> QUARTER SELECTOR </h3>
                <ul>
                    {lastDates.map(({ quarter, month, day }) => {
                        const nextQuarter = quarter === 4 ? 1 : quarter + 1;
                        const { month: nextMonth } = lastDates[nextQuarter - 1];

                        return (
                            <li key={quarter}>
                                <h5>
                                    QUARTER {quarter} (
                                    {quarter === 1 && `January - March)`}
                                    {quarter === 2 && `April - June)`}
                                    {quarter === 3 && `July - September)`}
                                    {quarter === 4 && `October - December)`}
                                    {extendedQuarter !== quarter && (
                                        <button
                                            className={`extend-button${quarter}`}
                                            onClick={() => handleExtendClick(quarter)}
                                        >
                                            EXTEND
                                        </button>
                                    )}

                                    {selectedQuarter === quarter && (
                                        <p className="selected-quarter-message">
                                            Selected Quarter: {quarter}
                                        </p>
                                    )}
                                </h5>
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div>
                <Link className='backtoAdmin' to='/Admin'> Back to Admin </Link>
            </div>
        </div>
    );
}

export default MyTimeExtension;

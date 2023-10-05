import { DatePicker } from '@progress/kendo-react-dateinputs';
import '@progress/kendo-theme-material/dist/all.css';
import axios from 'axios';
import React, { useState } from 'react';
import '../styles/Extend.css';
import { Link } from 'react-router-dom';
import { useLocation } from "react-router-dom";

function MyExtend({ label }) {
    const [selectedDate, setSelectedDate] = useState(null);
    const [isButtonClicked, setIsButtonClicked] = useState(false);

    const handleDateChange = (event) => {
        const newDate = new Date(event.target.value);
        setSelectedDate(newDate);
    };

    const location = useLocation();
    const selectedQuarter = location.state.selectedQuarter;
    
    const handleExtendClick = async () => {
        if (selectedDate) {
            try {
                const endDateAsDate = new Date(selectedDate);
                const currentQuarterstring = String(selectedQuarter); // Use the selected quarter
    
                const formattedEndDate = endDateAsDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    
                const payload = {
                    quarter: currentQuarterstring,
                    endDate: formattedEndDate // Use the formatted date
                }
                console.log("Payload sent to the server:", payload); // Add this line
    
                const response = await axios.put('http://127.0.0.1:8000/timeextension', payload);
    
                if (response.status === 200) {
                    setIsButtonClicked(true);
                    console.log(response.data.message);
                }
            } catch (error) {
                console.error('Error extending time:', error);
            }
        }
    };

    return (
        <div>
            <h2 className='heading'>Time Extension</h2>
            <div className="extension-container">
                {label && <label className="datepicker-label">{label}</label>}
                <div className="mydate">
                    <DatePicker value={selectedDate} onChange={handleDateChange} />
                </div>
                <button className="extend-button" onClick={handleExtendClick} disabled={!selectedDate}>
                    Extend Deadline
                </button>
                {isButtonClicked && selectedDate && (
                    <p className="selected-date-message">
                        Deadline has been extended up to {selectedDate.toLocaleDateString()}.
                    </p>
                )}
            </div>
            <div>
                <Link className='backtoTE' to='/TimeExtension'>Back</Link>
            </div>
        </div>
    );
}

export default MyExtend;

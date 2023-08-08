import React, { useState } from 'react';
import { DatePicker } from '@progress/kendo-react-dateinputs';
import '@progress/kendo-theme-material/dist/all.css';
import '../styles/DatePicker.css';

function MyDatePicker({ label }) {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  return (
    <div className="datepicker-wrapper">
      {label && <label className="datepicker-label">{label}</label>}
      <div className="mydate">
        <DatePicker value={selectedDate} onChange={handleDateChange} />
      </div>
    </div>
  );
}

export default MyDatePicker;
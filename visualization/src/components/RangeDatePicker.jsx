import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateRangePicker = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  return (
    <div className="flex justify-center items-center">
      <div className="space-y-4 text-center">
        <h2 className="text-2xl font-semibold">Select a Date Range</h2>
        <div className="flex space-x-4">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
          />
          <span className="text-xl">to</span>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
          />
        </div>
        <div>
          {startDate && endDate && (
            <p>
              Selected Range: {startDate.toDateString()} - {endDate.toDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;

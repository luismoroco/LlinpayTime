import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateRangePicker = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  return (
    <div className="flex justify-center items-center">
      <div className="space-y-4 text-center">
        <div className="flex space-x-4 items-center">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate} 
            className='shadow text-center p-1'
          />
          <span className="text-xl">TO</span>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            className='shadow text-center p-1'
          />
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;

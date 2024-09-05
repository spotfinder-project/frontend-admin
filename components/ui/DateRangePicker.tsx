import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Props {
  startDate: Date | null;
  endDate: Date | null;
  setDateRange: (update: [Date | null, Date | null]) => void;
}
const DateRangePicker = ({ startDate, endDate, setDateRange }: Props) => {
  return (
    <div>
      <DatePicker
        className="w-full"
        selectsRange
        onChange={(update: [Date | null, Date | null]) => setDateRange(update)}
        selectsStart
        startDate={startDate || undefined}
        endDate={endDate || undefined}
        dateFormat="yyyy/MM/dd"
        placeholderText="Start Date"
      />
    </div>
  );
};

export default DateRangePicker;

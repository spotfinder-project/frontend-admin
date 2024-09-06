"use client";
import React, { useState } from "react";
import DateRangePicker from "../ui/DateRangePicker";
import { addMonths } from "date-fns";

type DateRange = [Date | null, Date | null];

type NoticeType = "active" | "inactive" | undefined;

const NoticeQueryForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [isActive, setIsActive] = useState<NoticeType>(undefined);
  const today = new Date();
  const oneMonthFromNow = addMonths(today, -1);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    oneMonthFromNow,
    today,
  ]);
  const [startDate, endDate] = dateRange;

  const handleSearch = () => {
    // Implement search functionality here
    console.log(title);
  };

  const handleReset = () => {
    setTitle("");
    setIsActive(undefined);
    setDateRange([null, null]);
  };

  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold">공지 검색</h2>
      </div>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <div className="form-control">
          <label className="label" htmlFor="title">
            <span className="label-text">공지 제목</span>
          </label>
          <input
            type="text"
            maxLength={50}
            id="title"
            className="input input-bordered"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-control">
          <label className="label" htmlFor="resolved">
            <span className="label-text">게시 상태</span>
          </label>
          <select
            id="resolved"
            className="select select-bordered"
            value={isActive}
            onChange={(e) => setIsActive(e.target.value as NoticeType)}
          >
            <option value={undefined}>게시 상태</option>
            <option value="active">게시 중</option>
            <option value="inactive">게시 중지</option>
          </select>
        </div>
        <div className="form-control">
          <label className="label" htmlFor="createdDate">
            <span className="label-text">생성일</span>
          </label>

          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            setDateRange={setDateRange}
          />
        </div>

        {/* Buttons */}
        <div className="md:col-span-2 flex justify-end gap-4 mt-4">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSearch}
          >
            Search
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </form>
    </>
  );
};

export default NoticeQueryForm;

"use client";
import React, { useState } from "react";
import DateRangePicker from "../ui/DateRangePicker";
import { addMonths, format } from "date-fns";
import { NoticeParams } from "@/types/types";

type NoticeType = "Y" | "N" | undefined;

type Props = {
  handleQueryNotices: (params: NoticeParams) => void;
};

const NoticeQueryForm = ({ handleQueryNotices }: Props) => {
  const [title, setTitle] = useState("");
  const [isActive, setIsActive] = useState<NoticeType>(undefined);
  const today = new Date();
  const from = addMonths(today, -6);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    from,
    today,
  ]);
  const [startDate, endDate] = dateRange;

  const handleSearch = () => {
    // Implement search functionality here
    console.log(title);
    handleQueryNotices({
      title,
      valid: isActive,
      startDate: dateRange[0] ? format(dateRange[0], "yyyy-MM-dd") : undefined,
      endDate: dateRange[1] ? format(dateRange[1], "yyyy-MM-dd") : undefined,
    });
  };

  const handleReset = () => {
    setTitle("");
    setIsActive(undefined);
    setDateRange([from, today]);
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
            <option value="Y">게시 중</option>
            <option value="N">게시 중지</option>
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

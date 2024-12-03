"use client";
import React, {useState} from "react";
import DateRangePicker from "../ui/DateRangePicker";
import {addMonths, format} from "date-fns";
import {ReviewParams} from "@/types/types";

type Props = {
  clickQueryReviews: (searchParams: ReviewParams) => Promise<void>;
};

const UserQueryForm = ({clickQueryReviews}: Props) => {
  const [nickname, setNickname] = useState("");
  const [facilityName, setFacilityName] = useState("");
  const [content, setLocation] = useState("");
  const today = new Date();
  const from = addMonths(today, -6);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    from,
    today,
  ]);
  const [startDate, endDate] = dateRange;

  const handleSearch = () => {
    clickQueryReviews({
      nickname,
      facilityName,
      content,
      startDate: dateRange[0] ? format(dateRange[0], "yyyy-MM-dd") : undefined,
      endDate: dateRange[1] ? format(dateRange[1], "yyyy-MM-dd") : undefined,
    }).catch(err => console.log(err));
  };

  const updateDateRange = (update: [Date | null, Date | null]) => {
    console.log(update);
    setDateRange(update);
  };

  const handleReset = () => {
    setNickname("");
    setFacilityName("");
    setLocation("");
    setDateRange([from, today]);
  };

  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold">리뷰 검색</h2>
      </div>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <div className="form-control">
          <label className="label" htmlFor="nickname">
            <span className="label-text">닉네임</span>
          </label>
          <input
            type="text"
            id="nickname"
            className="input input-bordered"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>

        <div className="form-control">
          <label className="label" htmlFor="nickname">
            <span className="label-text">시설물 이름</span>
          </label>
          <input
            type="text"
            id="facilityName"
            className="input input-bordered"
            value={facilityName}
            onChange={(e) => setFacilityName(e.target.value)}
          />
        </div>

        <div className="form-control">
          <label className="label" htmlFor="content">
            <span className="label-text">내용</span>
          </label>
          <input
            type="text"
            id="content"
            className="input input-bordered"
            value={content}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {/* Created Date */}
        <div className="form-control">
          <label className="label" htmlFor="createdDate">
            <span className="label-text">생성일</span>
          </label>
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            setDateRange={updateDateRange}
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

export default UserQueryForm;

"use client";
import React, { useState } from "react";
import DateRangePicker from "../ui/DateRangePicker";
import { addMonths } from "date-fns";

type DateRange = [Date | null, Date | null];

const ReportQueryForm: React.FC = () => {
  const [reportId, setReportId] = useState("");
  const [reportContent, setReportContent] = useState("");
  const [facilityId, setFacilityId] = useState("");
  const [userId, setUserId] = useState("");
  const [resolved, setResolved] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const today = new Date();
  const oneMonthFromNow = addMonths(today, -1);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    oneMonthFromNow,
    today,
  ]);
  const [startDate, endDate] = dateRange;

  const handleSearch = () => {
    // Implement search functionality here
    console.log({
      reportId,
      facilityId,
      resolved,
      createdDate,
      reportContent,
      userId,
    });
  };

  const handleReset = () => {
    setReportId("");

    setResolved("Y");
    setFacilityId("");
    setCreatedDate("");
  };

  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold">시설물 검색</h2>
      </div>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <div className="form-control">
          <label className="label" htmlFor="reportContent">
            <span className="label-text">신고 내용</span>
          </label>
          <input
            type="text"
            maxLength={50}
            id="reportContent"
            className="input input-bordered"
            value={reportContent}
            onChange={(e) => setReportContent(e.target.value)}
          />
        </div>

        <div className="form-control">
          <label className="label" htmlFor="resolved">
            <span className="label-text">신고 상태</span>
          </label>
          <select
            id="resolved"
            className="select select-bordered"
            value={resolved}
            onChange={(e) => setResolved(e.target.value)}
          >
            <option value="" disabled>
              신고 상태
            </option>
            <option value="N">신고 요청</option>
            <option value="Y">해결 완료</option>
          </select>
        </div>

        <div className="form-control">
          <label className="label" htmlFor="address">
            <span className="label-text">주소</span>
          </label>
          <input
            type="text"
            id="userId"
            className="input input-bordered"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>

        <div className="form-control">
          <label className="label" htmlFor="facilityId">
            <span className="label-text">시설물 ID</span>
          </label>
          <input
            type="text"
            maxLength={50}
            id="facilityId"
            className="input input-bordered"
            value={facilityId}
            onChange={(e) => setFacilityId(e.target.value)}
          />
        </div>

        <div className="form-control">
          <label className="label" htmlFor="createdDate">
            <span className="label-text">Created Date</span>
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

export default ReportQueryForm;

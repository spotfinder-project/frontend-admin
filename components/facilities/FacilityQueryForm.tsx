"use client";
import { FacilityParams } from "@/types/types";
import React, { useState } from "react";
import DateRangePicker from "../ui/DateRangePicker";
import { addMonths, format } from "date-fns";

type Props = {
  clickQueryFacilities: (searchParams: FacilityParams) => Promise<void>;
};

const UserQueryForm = ({ clickQueryFacilities }: Props) => {
  const [facilityId, setFacilityId] = useState("");
  const [facilityType, setFacilityType] = useState("");
  const [facilityName, setFacilityName] = useState("");
  const [location, setLocation] = useState("");
  const [approved, setApproved] = useState("");
  const today = new Date();
  const oneMonthFromNow = addMonths(today, 1);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    today,
    oneMonthFromNow,
  ]);
  const [startDate, endDate] = dateRange;

  const handleSearch = () => {
    // Implement search functionality here

    clickQueryFacilities({
      facilityId,
      name: facilityName,
      type: facilityType as "R" | "S" | "T",
      location,
      approvalStatus: approved as "P" | "A" | "R" | "S",
      startDate: dateRange[0] ? format(dateRange[0], "yyyy-MM-dd") : undefined,
      endDate: dateRange[1] ? format(dateRange[1], "yyyy-MM-dd") : undefined,
    });
  };

  const updateDateRange = (update: [Date | null, Date | null]) => {
    console.log(update);
    setDateRange(update);
  };

  const handleReset = () => {
    setFacilityId("");
    setFacilityType("");
    setFacilityName("");
    setApproved("Y");
    setLocation("");
    setDateRange([today, oneMonthFromNow]);
  };

  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold">시설물 검색</h2>
      </div>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <div className="form-control">
          <label className="label" htmlFor="facilityId">
            <span className="label-text">시설물 ID</span>
          </label>
          <input
            type="text"
            id="facilityId"
            className="input input-bordered"
            value={facilityId}
            onChange={(e) => setFacilityId(e.target.value)}
          />
        </div>

        <div className="form-control">
          <label className="label" htmlFor="facilityId">
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
          <label className="label" htmlFor="facilityType">
            <span className="label-text">시설물 구분</span>
          </label>
          <select
            id="facilityType"
            className="select select-bordered"
            value={facilityType}
            onChange={(e) => setFacilityType(e.target.value)}
          >
            <option value="" disabled>
              시설물 구분
            </option>
            <option value="garbage">쓰레기통</option>
            <option value="toilet">화장실</option>
            <option value="smoking">흡연구역</option>
          </select>
        </div>

        <div className="form-control">
          <label className="label" htmlFor="location">
            <span className="label-text">주소</span>
          </label>
          <input
            type="text"
            id="location"
            className="input input-bordered"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {/* Approval status */}
        <div className="form-control">
          <label className="label" htmlFor="approved">
            <span className="label-text">승인 여부</span>
          </label>
          <select
            id="approved"
            className="select select-bordered"
            value={approved}
            onChange={(e) => setApproved(e.target.value)}
          >
            <option value="" disabled>
              승인 여부
            </option>
            <option value="P">승인 대기</option>
            <option value="A">승인 완료</option>
            <option value="R">승인 거절</option>
            <option value="S">승인 중단</option>
          </select>
        </div>

        {/* Created Date */}
        <div className="form-control">
          <label className="label" htmlFor="createdDate">
            <span className="label-text">Created Date</span>
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

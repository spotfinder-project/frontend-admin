"use client";
import React, { useState } from "react";

const UserQueryForm: React.FC = () => {
  const [facilityId, setFacilityId] = useState("");
  const [facilityType, setFacilityType] = useState("");
  const [address, setAddress] = useState("");
  const [approved, setApproved] = useState("");
  const [createdDate, setCreatedDate] = useState("");

  const handleSearch = () => {
    // Implement search functionality here
    console.log({ facilityId, facilityType, address, approved, createdDate });
  };

  const handleReset = () => {
    setFacilityId("");
    setFacilityType("");
    setApproved("Y");
    setAddress("");
    setCreatedDate("");
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
          <label className="label" htmlFor="address">
            <span className="label-text">주소</span>
          </label>
          <input
            type="text"
            id="address"
            className="input input-bordered"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        {/* Social Login */}
        <div className="form-control">
          <label className="label" htmlFor="approved">
            <span className="label-text">Social Login</span>
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
            <option value="N">미승인</option>
            <option value="Y">승인</option>
          </select>
        </div>

        {/* Created Date */}
        <div className="form-control">
          <label className="label" htmlFor="createdDate">
            <span className="label-text">Created Date</span>
          </label>
          <input
            type="date"
            id="createdDate"
            className="input input-bordered"
            value={createdDate}
            onChange={(e) => setCreatedDate(e.target.value)}
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

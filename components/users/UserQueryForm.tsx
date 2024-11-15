"use client";
import React, { useState } from "react";
import DateRangePicker from "../ui/DateRangePicker";
import { addMonths, format } from "date-fns";
import { User, UserParams } from "@/types/types";

type Props = {
  clickQueryUsers: (searchParams: UserParams) => Promise<void>;
};

const UserQueryForm = ({ clickQueryUsers }: Props) => {
  const [memberId, setMemberId] = useState("");
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState("");
  // const [birthDate, setBirthDate] = useState("");
  const [socialType, setSocialType] = useState("");
  const today = new Date();
  const from = addMonths(today, -6);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    from,
    today,
  ]);
  const [startDate, endDate] = dateRange;

  const handleSearch = () => {
    clickQueryUsers({
      memberId,
      nickname,
      gender,
      startDate: dateRange[0] ? format(dateRange[0], "yyyy-MM-dd") : undefined,
      endDate: dateRange[1] ? format(dateRange[1], "yyyy-MM-dd") : undefined,
      socialType,
    });
  };

  const updateDateRange = (update: [Date | null, Date | null]) => {
    console.log(update);
    setDateRange(update);
  };

  const handleReset = () => {
    setMemberId("");
    setNickname("");
    setGender("");
    setSocialType("");
    setDateRange([from, today]);
  };

  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold">사용자 검색</h2>
      </div>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <div className="form-control">
          <label className="label" htmlFor="memberId">
            <span className="label-text">Member Id</span>
          </label>
          <input
            type="text"
            id="memberId"
            className="input input-bordered"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
          />
        </div>
        {/* Name */}
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

        {/* gender */}
        <div className="form-control">
          <label className="label" htmlFor="gender">
            <span className="label-text">성별</span>
          </label>
          <select
            id="gender"
            className="select select-bordered"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="" disabled>
              Select gender
            </option>
            <option value="M">M</option>
            <option value="F">F</option>
          </select>
        </div>

        {/* Birth Date */}
        {/* <div className="form-control">
          <label className="label" htmlFor="birthDate">
            <span className="label-text">생년월일</span>
          </label>
          <input
            type="date"
            id="birthDate"
            className="input input-bordered"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
        </div> */}

        {/* Social Login */}
        <div className="form-control">
          <label className="label" htmlFor="socialType">
            <span className="label-text">Social Login</span>
          </label>
          <select
            id="socialType"
            className="select select-bordered"
            value={socialType}
            onChange={(e) => setSocialType(e.target.value)}
          >
            <option value="" disabled>
              Select social login
            </option>
            <option value="N">네이버</option>
            <option value="K">카카오톡</option>
          </select>
        </div>

        {/* Created Date */}
        <div className="form-control">
          <label className="label" htmlFor="createdDate">
            <span className="label-text">회원 생성일</span>
          </label>
          {/* <input
            type="date"
            id="createdDate"
            className="input input-bordered"
            value={createdDate}
            onChange={(e) => setCreatedDate(e.target.value)}
          /> */}
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

"use client";
import { Notice } from "@/types/types";
import { useState } from "react";

const NoticeDetailPage = () => {
  const [isEditing, setIsEditing] = useState(false);

  const selectedReview: Notice = {
    noticeId: 1,
    title: "시설물 사용에 대한 공지사항입니다.",
    content: "청결하게 사용해주세요!",
    valid: "Y",
    createdAt: "2024-09-01 10:30:00",
  };

  const [activeStatus, setActiveStatus] = useState<"Y" | "N">(
    selectedReview.valid
  );
  const [noticeTitle, setNoticeTitle] = useState(selectedReview.title);
  const [noticeContent, setNoticeContent] = useState(selectedReview.content);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setActiveStatus("N"); // Resetting approval status
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    // Save logic goes here
  };

  return (
    <div className="container mx-auto p-4">
      {/* 신고/제보 정보 Section */}
      <h2 className="text-2xl font-bold mb-4">공지사항 상세 정보</h2>
      <div className="grid grid-cols-1 ">
        <div className="form-control">
          <label className="label">상태</label>
          <select
            className="select select-bordered w-full"
            value={activeStatus}
            disabled={!isEditing}
            onChange={(e) => setActiveStatus(e.target.value as "Y" | "N")}
          >
            <option value="Y">개시 중</option>
            <option value="N">개시 중지</option>
          </select>
        </div>
        <div className="form-control">
          <label className="label">제목</label>
          <input
            type="text"
            className="input input-bordered"
            value={noticeTitle}
            disabled={!isEditing}
          />
        </div>

        <div className="form-control">
          <label className="label">내용</label>
          <textarea
            className="textarea textarea-bordered w-full"
            disabled={!isEditing}
            value={noticeContent}
          ></textarea>
        </div>

        <div className="form-control">
          <label className="label">생성일</label>
          <input
            type="text"
            className="input input-bordered"
            value={selectedReview.createdAt}
            disabled
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-8 flex justify-center">
        {!isEditing ? (
          <button className="btn btn-primary" onClick={handleEditClick}>
            수정하기
          </button>
        ) : (
          <div className="flex space-x-4">
            <button className="btn btn-success" onClick={handleSaveClick}>
              수정완료
            </button>
            <button className="btn btn-secondary" onClick={handleCancelClick}>
              취소
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticeDetailPage;

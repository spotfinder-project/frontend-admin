"use client";
import { useState } from "react";
import Image from "next/image";

const ReportDetailPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState<"Y" | "N">("N");
  const [processingContent, setProcessingContent] = useState("");
  const [images, setImages] = useState([
    "/sample-image1.jpg",
    "/sample-image2.jpg",
  ]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setApprovalStatus("N"); // Resetting approval status
    setProcessingContent(""); // Resetting processing content
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    // Save logic goes here
  };

  return (
    <div className="container mx-auto p-4">
      {/* 신고/제보 정보 Section */}
      <h2 className="text-2xl font-bold mb-4">신고/제보 정보</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">신고자 ID</label>
          <input
            type="text"
            className="input input-bordered"
            value="123"
            disabled
          />
        </div>

        <div className="form-control">
          <label className="label">닉네임</label>
          <input
            type="text"
            className="input input-bordered"
            value="123"
            disabled
          />
        </div>
        <div className="form-control">
          <label className="label">승인 상태</label>
          <select
            className="select select-bordered w-full"
            value={approvalStatus}
            disabled={!isEditing}
            onChange={(e) => setApprovalStatus(e.target.value as "Y" | "N")}
          >
            <option value="Y">Y</option>
            <option value="N">N</option>
          </select>
        </div>
        <div className="form-control">
          <label className="label">생성일</label>
          <input
            type="text"
            className="input input-bordered"
            value="2024-09-01"
            disabled
          />
        </div>
        <div className="form-control">
          <label className="label">신고 내용</label>
          <textarea
            className="textarea textarea-bordered w-full"
            disabled
            value="위치가 틀립니다"
          ></textarea>
        </div>

        <div className="form-control">
          <label className="label">처리 내용</label>
          <textarea
            className="textarea textarea-bordered w-full"
            disabled={!isEditing}
            value={processingContent}
            onChange={(e) => setProcessingContent(e.target.value)}
          ></textarea>
        </div>
      </div>

      {/* 신고 시설물 제보 Section */}
      <h2 className="text-2xl font-bold mt-8 mb-4">신고 시설물 정보</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">시설물 ID</label>
          <input type="text" className="input input-bordered w-full" disabled />
        </div>

        <div className="form-control">
          <label className="label">시설물 명</label>
          <input type="text" className="input input-bordered w-full" disabled />
        </div>

        <div className="form-control">
          <label className="label">주소</label>
          <input type="text" className="input input-bordered w-full" disabled />
        </div>

        <div className="form-control">
          <label className="label">상세 위치</label>
          <input type="text" className="input input-bordered w-full" disabled />
        </div>

        <div className="form-control">
          <label className="label">관리 부서</label>
          <input type="text" className="input input-bordered w-full" disabled />
        </div>

        <div className="form-control">
          <label className="label">관리부서 번호</label>
          <input type="text" className="input input-bordered w-full" disabled />
        </div>

        <div className="form-control">
          <label className="label">승인 상태</label>
          <select className="select select-bordered w-full" disabled>
            <option value="Y">Y</option>
            <option value="N">N</option>
          </select>
        </div>

        <div className="form-control">
          <label className="label">생성일</label>
          <input
            type="text"
            className="input input-bordered"
            value="2024-09-01"
            disabled
          />
        </div>
      </div>

      {/* 사진 Section */}
      <h3 className="text-xl font-bold mt-4">이미지</h3>
      <div className="flex mt-4 p-4">
        {images.length > 0 &&
          images.map((image, index) => (
            <div
              className={`relative ${index % 2 !== 0 ? "ml-4" : ""}`}
              key={index}
            >
              <Image
                src={image}
                alt={`Facility Image ${index + 1}`}
                width={200}
                height={200}
                className="w-[200px] h-[200px]"
              />
            </div>
          ))}
        {!images.length && <p>이미지가 없습니다.</p>}
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

export default ReportDetailPage;

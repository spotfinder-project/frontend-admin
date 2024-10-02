"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ReportDetail } from "@/types/types";
import useSWR, { mutate } from "swr";
import { toast } from "react-toastify";

interface Props {
  params: {
    id: string;
  };
}

const ReportDetailPage = ({ params: { id } }: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  // const selectedReport: ReportDetail = {
  //   reportId: 1,
  //   content: "현재는 해당 시설물이 존재하지 않습니다.",
  //   answer: "처리 완료했습니다!",
  //   status: "Y",
  //   createdDate: "2024-09-01",
  //   memberId: 1,
  //   nickname: "Kim",
  //   facility: {
  //     facilityId: 1,
  //     type: "R",
  //     name: "쌍문역 내 화장실",
  //     location: "쌍문역",
  //     detailLocation: "지하 1층",
  //     information: "개찰구 내에 존재합니다.",
  //     department: "서울시설공단",
  //     departmentPhoneNumber: "02-2290-7111",
  //     approvalStatus: "A",
  //     createdDate: "2024-09-01",
  //     images: [],
  //   },
  // };
  const [selectedReport, setSelectedReport] = useState<ReportDetail>();
  const [approvalStatus, setApprovalStatus] = useState<"Y" | "N">(
    selectedReport?.status as "Y" | "N"
  );
  const [answer, setAnswer] = useState(selectedReport?.answer);
  const [facility, setFacility] = useState(selectedReport?.facility);

  const { data, error } = useSWR(`/api/reports/${id}`);

  useEffect(() => {
    if (data && data.data) {
      const report = data.data;
      setSelectedReport(report);
      setFacility(report.faclity);
    }
  }, [data]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setApprovalStatus("N"); // Resetting approval status
    setAnswer(""); // Resetting processing content
  };

  const handleSaveClick = async () => {
    // Save logic goes here
    try {
      const bodyParams = {
        reportId: id,
        status: approvalStatus,
        answer,
      };

      const response = await fetch("/api/reports", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(bodyParams),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Report Update Failed");
      }

      const data = await response.json();

      if (data.code === "REQ000") {
        toast.success("신고/제보 수정을 완료했습니다.");
        await mutate(`/api/reports/${id}`);
        setIsEditing(false);
      } else if (data.code === "FAC000") {
        toast.error("신고/제보 정보가 존재하지 않습니다.");
      }
    } catch (err) {
      toast.error("수정을 실패하였습니다. 다시 시도해 주세요.");
    }
  }; //NOTE: 테스트 필요

  if (!data) return <div>신고 정보가 존재하지 않습니다.</div>;

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
            value={selectedReport?.memberId}
            disabled
          />
        </div>

        <div className="form-control">
          <label className="label">닉네임</label>
          <input
            type="text"
            className="input input-bordered"
            value={selectedReport?.nickname}
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
            value={selectedReport?.createdDate}
            disabled
          />
        </div>
        <div className="form-control">
          <label className="label">신고 내용</label>
          <textarea
            className="textarea textarea-bordered w-full"
            disabled
            value={selectedReport?.content}
          ></textarea>
        </div>

        <div className="form-control">
          <label className="label">처리 내용</label>
          <textarea
            className="textarea textarea-bordered w-full"
            disabled={!isEditing}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          ></textarea>
        </div>
      </div>

      {/* 신고 시설물 제보 Section */}
      <h2 className="text-2xl font-bold mt-8 mb-4">신고 시설물 정보</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">시설물 ID</label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={facility?.facilityId}
            disabled
          />
        </div>

        <div className="form-control">
          <label className="label">시설물 명</label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={facility?.name}
            disabled
          />
        </div>

        <div className="form-control">
          <label className="label">주소</label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={facility?.location}
            disabled
          />
        </div>

        <div className="form-control">
          <label className="label">상세 위치</label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={facility?.detailLocation}
            disabled
          />
        </div>

        <div className="form-control">
          <label className="label">관리 부서</label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={facility?.department}
            disabled
          />
        </div>

        <div className="form-control">
          <label className="label">관리부서 번호</label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={facility?.departmentPhoneNumber}
            disabled
          />
        </div>

        <div className="form-control">
          <label className="label">승인 상태</label>
          <select
            className="select select-bordered w-full"
            disabled
            value={facility?.approvalStatus}
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
            value={facility?.createdDate}
            disabled
          />
        </div>
      </div>

      {/* 사진 Section */}
      <h3 className="text-xl font-bold mt-4">이미지</h3>
      <div className="flex flex-wrap mt-4 p-4">
        {facility?.images &&
          facility?.images.length > 0 &&
          facility.images.map((image, index) => (
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
        {!facility?.images.length && <p>이미지가 없습니다.</p>}
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

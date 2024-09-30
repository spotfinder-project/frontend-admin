"use client";
import { Notice } from "@/types/types";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import { useParams } from "next/navigation";
import { handleUpdateNotice } from "@/service/noticeService";

const NoticeDetailPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { id } = useParams();
  const { data, error } = useSWR(`/api/notices/${id}`);

  const [activeStatus, setActiveStatus] = useState<"Y" | "N" | null>(null);
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeContent, setNoticeContent] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  useEffect(() => {
    if (data && data.data) {
      const item = data.data;
      setActiveStatus(item.valid);
      setNoticeTitle(item.title);
      setNoticeContent(item.content);
      setCreatedAt(item.createdAt);
    }
  }, [data]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleSaveClick = async () => {
    try {
      const response = await handleUpdateNotice({
        noticeId: id as string,
        title: noticeTitle,
        content: noticeContent,
        valid: activeStatus as "Y" | "N",
      });

      if (response.code === "REQ000") {
        await mutate(`/api/notices/${id}`);
        setIsEditing(false);
      }
    } catch (err) {
      console.error(err);
    }

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
            value={activeStatus ?? undefined}
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
            onChange={(e) => setNoticeTitle(e.target.value)}
          />
        </div>

        <div className="form-control">
          <label className="label">내용</label>
          <textarea
            className="textarea textarea-bordered w-full"
            disabled={!isEditing}
            value={noticeContent}
            onChange={(e) => setNoticeContent(e.target.value)}
          ></textarea>
        </div>

        <div className="form-control">
          <label className="label">생성일</label>
          <input
            type="text"
            className="input input-bordered"
            value={createdAt}
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

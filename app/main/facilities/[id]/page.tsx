"use client";
import AddressSearch from "@/components/facilities/AddressSearch";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import Image from "next/image";
import { ChangeEvent, useState } from "react";

interface Props {
  params: {
    id: string;
  };
}

const facilityReviewColumns = [
  {
    label: "사용자 ID",
    value: "userId",
  },
  {
    label: "리뷰 내용",
    value: "content",
  },
  {
    label: "닉네임",
    value: "nickname",
  },
  {
    label: "생성일",
    value: "createdDate",
  },
  {
    label: "삭제",
    value: "delete",
  },
];

export default function FacilityDetail({ params: { id } }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [facilityType, setFacilityType] = useState("");
  const [images, setImages] = useState([
    "/sample-image1.jpg",
    "/sample-image2.jpg",
  ]);

  const facilityReviews = [
    {
      id: "terw",
      userId: "user123",
      content: "Great facility!",
      nickname: "nickname1",
      createdDate: "2023-08-28",
    },
    {
      id: "terw",
      userId: "user12345",
      content: "Needs improvement!",
      nickname: "nickname1",
      createdDate: "2023-08-28",
    },
  ];

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setImages((prevImages) => [...prevImages, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleDeleteReview = (item: any) => {
    //delete review 추후 수정
    console.log("delete review", item);
    setSelectedReviewId(item.id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {};

  const handleCloseDelete = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="card bg-base-100 shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-4">시설물 정보</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">시설물 ID</label>
            <input
              type="text"
              className="input input-bordered"
              disabled
              value="12345"
            />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="facilityType">
              <span className="label-text text-base">시설물 구분</span>
            </label>
            <select
              id="facilityType"
              className="select select-bordered"
              value={facilityType}
              onChange={(e) => setFacilityType(e.target.value)}
              disabled={!isEditing}
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
            <label className="label">시설 이름</label>
            <input
              type="text"
              className="input input-bordered"
              disabled={!isEditing}
              value="Sample Facility"
            />
          </div>
          <AddressSearch
            facilityAddress={"sample address"}
            isEditing={isEditing}
          />
          <div className="form-control">
            <label className="label">상세 주소</label>
            <input
              type="text"
              className="input input-bordered"
              disabled={!isEditing}
              value="Sample Detailed Address"
            />
          </div>
          <div className="form-control">
            <label className="label">추가설명</label>
            <input
              type="text"
              className="input input-bordered"
              disabled={!isEditing}
              value="Additional Info"
            />
          </div>
          <div className="form-control">
            <label className="label">관리부서</label>
            <input
              type="text"
              className="input input-bordered"
              disabled={!isEditing}
              value="Management Dept."
            />
          </div>
          <div className="form-control">
            <label className="label">관리부서 번호</label>
            <input
              type="text"
              className="input input-bordered"
              disabled={!isEditing}
              value="123-456-7890"
            />
          </div>
          <div className="form-control">
            <label className="label">승인 상태</label>
            <input
              type="text"
              className="input input-bordered"
              disabled={!isEditing}
              value="Pending"
            />
          </div>
          <div className="form-control">
            <label className="label">승인 요청자 ID</label>
            <input
              type="text"
              className="input input-bordered"
              disabled={!isEditing}
              value="requester123"
            />
          </div>
          <div className="form-control">
            <label className="label">생성일</label>
            <input
              type="text"
              className="input input-bordered"
              disabled
              value="2023-01-01"
            />
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">이미지</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div className="relative" key={index}>
              <Image
                src={image}
                alt={`Facility Image ${index + 1}`}
                width={300}
                height={300}
                className="w-full h-auto"
              />
              {isEditing && (
                <button
                  className="btn btn-sm btn-error absolute top-2 right-2"
                  onClick={() => handleImageRemove(index)}
                >
                  X
                </button>
              )}
            </div>
          ))}
          {isEditing && (
            <div className="flex items-center justify-center border-2 border-dashed border-gray-400 w-[300px] h-[300px]">
              <label className="cursor-pointer">
                <span className="btn btn-sm btn-primary">+</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          )}
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">리뷰</h2>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                {facilityReviewColumns.map((column) => (
                  <th key={column.value}>{column.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {facilityReviews.map((data, index) => (
                <tr key={index}>
                  {facilityReviewColumns.map((column) =>
                    column.value !== "delete" ? (
                      <td key={column.value}>{(data as any)[column.value]}</td>
                    ) : (
                      <td key="delete">
                        <button
                          className="btn btn-neutral"
                          onClick={() => handleDeleteReview(data)}
                        >
                          Delete
                        </button>
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-8">
          <button
            className="btn btn-warning mr-2"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "완료" : "수정하기"}
          </button>
          {isEditing && <button className="btn btn-error">취소</button>}
          {!isEditing && <button className="btn btn-error">시설물 삭제</button>}
        </div>

        {isDeleteModalOpen && selectedReviewId && (
          <ConfirmationModal
            itemId={selectedReviewId}
            isOpen={isDeleteModalOpen}
            onConfirm={handleConfirmDelete}
            onCancel={handleCloseDelete}
            message="정말 삭제하시겠습니까?"
          />
        )}
      </div>
    </div>
  );
}
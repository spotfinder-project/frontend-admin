"use client";
import AddressSearch from "@/components/facilities/AddressSearch";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { FacilityDetail, FacilityReview } from "@/types/types";
import Image from "next/image";
import { ChangeEvent, useMemo, useState } from "react";
import { getCoordinatesFromAddress } from "@/service/geoService";
import CustomTable from "@/components/ui/CustomTable";
import Pagination from "@/components/ui/Pagination";

interface Props {
  params: {
    id: string;
  };
}

interface TableData {
  id: string;
  [key: string]: any;
}

const facilityReviewColumns = [
  {
    label: "사용자 ID",
    id: "memberId",
  },
  {
    label: "리뷰 내용",
    id: "content",
  },
  {
    label: "닉네임",
    id: "nickname",
  },
  {
    label: "생성일",
    id: "createdDate",
  },
];

export default function FacilityDetailPage({ params: { id } }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [facilityType, setFacilityType] = useState("");
  const [images, setImages] = useState([
    "/sample-image1.jpg",
    "/sample-image2.jpg",
  ]);
  const facilityDetail: FacilityDetail = {
    facilityId: 1,
    type: "R",
    name: "쌍문역 내 화장실",
    location: "쌍문역",
    detailLocation: "지하 1층",
    information: "개찰구 내에 존재합니다.",
    department: "서울시설공단",
    departmentPhoneNumber: "02-2290-7111",
    approvalStatus: "A",
    memberId: "test1234",
    createdDate: "2024-09-01",
    images: [
      "https://spotfinder-image.s3.ap-northeast-2.amazonaws.com/facility/2024/09/14/4-222150239.png",
    ],
  };

  const [selectedFacility, setSelectedFacility] =
    useState<FacilityDetail | null>(facilityDetail);

  const [selectedAddress, setSelectedAddress] = useState("");

  const facilityReviews: FacilityReview[] = [
    {
      reviewId: 1,
      content: "시설물이 청결합니다~",
      createdDate: "2024-09-01",
      memberId: "1",
      nickname: "SBS",
    },
    {
      reviewId: 3,
      content: "시설물이 청결합니다~",
      createdDate: "2024-09-01",
      memberId: "1",
      nickname: "SBS",
    },
  ];

  const facilityReviewData = [
    {
      id: "1",
      reviewId: 1,
      content: "시설물이 청결합니다~",
      createdDate: "2024-09-01",
      memberId: "1",
      nickname: "SBS",
    },
    {
      id: "3",
      reviewId: 3,
      content: "시설물이 청결합니다~",
      createdDate: "2024-09-01",
      memberId: "1",
      nickname: "SBS",
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

  const handleConfirmDeleteFacility = () => {
    console.log("here");
    console.log(selectedFacility?.facilityId);
  };

  const handleCloseConfirmModal = () => {
    setIsDeleteModalOpen(false);
  };

  const updateAddress = (address: string) => {
    setSelectedAddress(address);
  };

  const handleClickEditOrConfirm = async (isEditing: boolean) => {
    setIsEditing(!isEditing);
    console.log(isEditing);

    if (isEditing) {
      //주소 위경도 변환
      const geoData = await getCoordinatesFromAddress(selectedAddress);
      console.log(geoData);
    }
  };

  // 리뷰 테이블 관련

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = facilityReviewData.map((review) => review.id);
      setSelectedReviews(newSelected);
      return;
    }
    setSelectedReviews([]);
  };

  const handleSelectReviews = (
    event: ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    const selectedIndex = selectedReviews.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedReviews, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedReviews.slice(1));
    } else if (selectedIndex === selectedReviews.length - 1) {
      newSelected = newSelected.concat(selectedReviews.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedReviews.slice(0, selectedIndex),
        selectedReviews.slice(selectedIndex + 1)
      );
    }

    setSelectedReviews(newSelected);
  };

  const handleChangePage = (newPage: number) => {
    setPage(newPage - 1);
  };

  const totalPages = useMemo(
    () => Math.ceil(facilityReviewData.length / rowsPerPage),
    facilityReviewData
  );

  const handleDeleteReviews = () => {
    console.log(selectedReviews);
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
              value={selectedFacility?.facilityId}
            />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="facilityType">
              <span className="label-text text-base">시설물 구분</span>
            </label>
            <select
              id="facilityType"
              className="select select-bordered"
              value={selectedFacility?.type}
              onChange={(e) => setFacilityType(e.target.value)}
              disabled={!isEditing}
            >
              <option value="" disabled>
                시설물 구분
              </option>
              <option value="T">쓰레기통</option>
              <option value="R">화장실</option>
              <option value="S">흡연구역</option>
            </select>
          </div>
          <div className="form-control">
            <label className="label">시설 이름</label>
            <input
              type="text"
              className="input input-bordered"
              disabled={!isEditing}
              value={selectedFacility?.name}
            />
          </div>
          <AddressSearch
            updateAddress={updateAddress}
            facilityAddress={selectedAddress}
            isEditing={isEditing}
          />
          <div className="form-control">
            <label className="label">상세 주소</label>
            <input
              type="text"
              className="input input-bordered"
              disabled={!isEditing}
              value={selectedFacility?.detailLocation}
            />
          </div>
          <div className="form-control">
            <label className="label">추가설명</label>
            <input
              type="text"
              className="input input-bordered"
              disabled={!isEditing}
              value={selectedFacility?.information}
            />
          </div>
          <div className="form-control">
            <label className="label">관리부서</label>
            <input
              type="text"
              className="input input-bordered"
              disabled={!isEditing}
              value={selectedFacility?.department}
            />
          </div>
          <div className="form-control">
            <label className="label">관리부서 번호</label>
            <input
              type="text"
              className="input input-bordered"
              disabled={!isEditing}
              value={selectedFacility?.departmentPhoneNumber}
            />
          </div>
          <div className="form-control">
            <label className="label">승인 상태</label>
            <input
              type="text"
              className="input input-bordered"
              disabled={!isEditing}
              value={selectedFacility?.approvalStatus}
            />
          </div>
          <div className="form-control">
            <label className="label">승인 요청자 ID</label>
            <input
              type="text"
              className="input input-bordered"
              disabled={!isEditing}
              value={selectedFacility?.memberId}
            />
          </div>
          <div className="form-control">
            <label className="label">생성일</label>
            <input
              type="text"
              className="input input-bordered"
              disabled
              value={selectedFacility?.createdDate}
            />
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">이미지</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {selectedFacility?.images.map((image, index) => (
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
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold mt-8 mb-4">리뷰</h2>
          <button
            className="btn btn-sm  btn-error mt-4"
            onClick={handleDeleteReviews}
            disabled={selectedReviews.length === 0}
          >
            Delete
          </button>
        </div>

        <div className="overflow-x-auto">
          <CustomTable
            columns={facilityReviewColumns}
            data={facilityReviewData}
            selectedRows={selectedReviews}
            rowsPerPage={rowsPerPage}
            page={page}
            onSelectAll={handleSelectAllClick}
            onSelectRow={handleSelectReviews}
          />

          <div className="flex justify-center items-center p-4">
            <Pagination
              currentPage={page + 1} // Adjusting for one-based index
              totalPages={totalPages}
              onPageChange={handleChangePage}
            />
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button
            className="btn btn-warning mr-2"
            onClick={() => handleClickEditOrConfirm(isEditing)}
          >
            {isEditing ? "완료" : "수정하기"}
          </button>
          {isEditing && (
            <button
              className="btn btn-error"
              onClick={() => setIsEditing(false)}
            >
              취소
            </button>
          )}
          {!isEditing && (
            <button
              className="btn btn-error"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              시설물 삭제
            </button>
          )}
        </div>

        {isDeleteModalOpen && selectedFacility && (
          <ConfirmationModal
            isOpen={isDeleteModalOpen}
            onConfirm={handleConfirmDeleteFacility}
            onCancel={handleCloseConfirmModal}
            message="정말 삭제하시겠습니까?"
          />
        )}

        {isDeleteModalOpen && selectedReviews.length > 0 && (
          <ConfirmationModal
            isOpen={isDeleteModalOpen}
            onConfirm={handleDeleteReviews}
            onCancel={handleCloseConfirmModal}
            message="정말 삭제하시겠습니까?"
          />
        )}
      </div>
    </div>
  );
}

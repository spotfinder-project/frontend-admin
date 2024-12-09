"use client";
import AddressSearch from "@/components/facilities/AddressSearch";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { FacilityDetail, FacilityReview } from "@/types/types";
import Image from "next/image";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { getCoordinatesFromAddress } from "@/service/geoService";
import CustomTable from "@/components/ui/CustomTable";
import Pagination from "@/components/ui/Pagination";
import { useParams } from "next/navigation";
import useSWR, { mutate } from "swr";
import {
  getImageIds,
  handleAddImages,
  handleUpdateFacility,
} from "@/service/facilityService";
import { toast } from "react-toastify";
import { handleImageUpload } from "@/utils/util";
import { useRouter } from "next/navigation";
import Loading from "@/components/ui/Loading";

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
    label: "리뷰 ID",
    id: "reviewId",
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
    label: "사용자 ID",
    id: "memberId",
  },
  {
    label: "생성일",
    id: "createdDate",
  },
];

export default function FacilityDetailPage({ params: { id } }: Props) {
  // const { id } = useParams();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [facilityType, setFacilityType] = useState("");
  const [selectedFacility, setSelectedFacility] =
    useState<FacilityDetail | null>(null);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [detailLocation, setDetailLocation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [facilityReviews, setFacilityReviews] = useState<TableData[]>([]);
  const [information, setInformation] = useState("");
  const [approval, setApproval] = useState<"P" | "A" | "R" | "S">("A");
  const [department, setDepartment] = useState("");
  const [name, setName] = useState("");
  const [imageData, setImageData] = useState<File[]>([]);
  const [images, setImages] = useState<
    {
      url: string;
      imageId: number | null;
    }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const {
    data: facilityData,
    error: facilityError,
    isLoading,
  } = useSWR(`/api/facilities/${id}`);

  const { data: reviewData, error: reviewError } = useSWR(
    `/api/facilities/reviews?facilityId=${id}`
  );

  useEffect(() => {
    if (facilityData && facilityData.data) {
      const facility = facilityData.data;
      setSelectedFacility(facility);
      setName(facility.name);
      setFacilityType(facility.type);
      setSelectedAddress(facility.location);
      setDetailLocation(facility.detailedLocation);
      setPhoneNumber(facility.phoneNumber);
      setInformation(facility.information);
      setApproval(facility.approvalStatus);
      setDepartment(facility.department);
      setImages(facility.images);
    }
  }, [facilityData]);

  useEffect(() => {
    if (reviewData && reviewData.list) {
      setFacilityReviews(
        reviewData.list.map((item: FacilityReview) => {
          return { ...item, id: item.reviewId };
        })
      );
    }
  }, [reviewData]);

  const totalPages = useMemo(
    () => Math.ceil(facilityReviews.length / rowsPerPage),
    [facilityReviews.length, rowsPerPage]
  );
  const handleImageRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const reader = new FileReader();

        reader.onloadend = () => {
          if (reader.result) {
            setImageData((prev) => [...prev, file]);
            setImages((prevImages) => [
              ...prevImages,
              { url: reader.result as string, imageId: null },
            ]);
          }
        };

        reader.readAsDataURL(file); // Create the preview
      } catch (error) {
        console.error("Image upload error:", error);
      }
    }
  };

  const handleConfirmDeleteFacility = async () => {
    try {
      if (!selectedFacility) return;

      setLoading(true);
      const response = await fetch(`/api/facilities`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ facilityIds: [selectedFacility.facilityId] }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      if (data.code === "REQ000") {
        toast.success("시설물을 삭제하였습니다.");
        handleCloseConfirmModal();
        router.push("/main/facilities");
      }
    } catch (err) {
      console.error("filated to delete the review:", err);
      toast.error("시설물 삭제를 할 수 없습니다. 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseConfirmModal = () => {
    setIsDeleteModalOpen(false);
  };

  const updateAddress = (address: string) => {
    setSelectedAddress(address);
  };

  const handleClickEditOrConfirm = async (isEditing: boolean) => {
    if (isEditing) {
      try {
        setLoading(true);
        const updatedIds = images
          .filter((item) => item.imageId)
          .map((item) => item.imageId);
        if (imageData.length > 0) {
          const addImageResponse = await getImageIds(imageData);
          const ids = addImageResponse?.data?.imageIds ?? [];
          updatedIds.push(...ids);
        }

        const geoData = await getCoordinatesFromAddress(selectedAddress);
        const bodyParams = {
          facilityId: selectedFacility?.facilityId as number,
          type: facilityType as "T" | "R" | "S",
          name,
          location: selectedAddress,
          detailLocation,
          latitude: parseFloat(geoData?.latitude),
          longitude: parseFloat(geoData?.longitude),
          information,
          department,
          departmentPhoneNumber: phoneNumber,
          approvalStatus: approval as "P" | "A" | "R" | "S",
          imageIds: updatedIds as number[],
        };

        const response = await handleUpdateFacility(bodyParams);
        if (response.code === "REQ000") {
          toast.success("시설물 수정을 완료했습니다.");
          await mutate(`/api/facilities/${id}`);
          await mutate(`/api/facilities/reviews?facilityId=${id}`);
        } else if (response.code === "FAC000") {
          toast.error("시설물 정보가 존재하지 않습니다.");
        }
      } catch (err) {
        console.log(err);
        toast.error("시설물 수정을 할 수 없습니다. 다시 시도해 주세요.");
      } finally {
        setLoading(false);
        setIsEditing(false);
      }
    }
  };

  // 리뷰 테이블 관련

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = facilityReviews.map((review) => review.id);
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

  const handleDeleteReviews = async () => {
    // console.log(selectedReviews);
    try {
      if (!selectedReviews.length) return;
      setLoading(true);
      const response = await fetch(`/api/reviews`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ reviewIds: selectedReviews }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      if (data.code === "REQ000") {
        toast.success("리뷰를 삭제하였습니다.");
        await mutate(`/api/facilities/reviews?facilityId=${id}`);
      }
    } catch (err) {
      console.error("filated to delete the review:", err);
      toast.error("리뷰 삭제를 할 수 없습니다. 다시 시도해 주세요.");
    } finally {
      setIsDeleteModalOpen(false);
      setLoading(false);
    }
  }; //NOTE: test 필요

  if (isLoading) return <Loading loading={isLoading} />;

  return (
    <div className="container mx-auto p-4">
      <div className="card bg-base-100 shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-4">시설물 정보</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">시설물 ID</label>
            <input
              className="input input-bordered"
              disabled
              value={selectedFacility?.facilityId || ""}
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
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {facilityData && (
            <AddressSearch
              updateAddress={updateAddress}
              facilityAddress={selectedAddress}
              isEditing={isEditing}
            />
          )}

          <div className="form-control">
            <label className="label">상세 주소</label>
            <input
              type="text"
              className="input input-bordered"
              disabled={!isEditing}
              value={detailLocation ?? ""}
              onChange={(e) => setDetailLocation(e.target.value)}
            />
          </div>
          <div className="form-control">
            <label className="label">추가설명</label>
            <input
              type="text"
              className="input input-bordered"
              disabled={!isEditing}
              value={information ?? ""}
              onChange={(e) => setInformation(e.target.value)}
            />
          </div>
          <div className="form-control">
            <label className="label">관리부서</label>
            <input
              type="text"
              className="input input-bordered"
              disabled={!isEditing}
              value={department ?? ""}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>
          <div className="form-control">
            <label className="label">관리부서 번호</label>
            <input
              type="text"
              className="input input-bordered"
              disabled={!isEditing}
              value={phoneNumber ?? ""}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className="form-control">
            <label className="label">승인 상태</label>
            <select
              id="approvalStatus"
              className="select select-bordered"
              value={approval}
              onChange={(e) =>
                setApproval(e.target.value as "P" | "A" | "R" | "S")
              }
              disabled={!isEditing}
            >
              <option value="P">승인대기</option>
              <option value="A">승인완료</option>
              <option value="R">승인거절</option>
              <option value="S">승인중지</option>
            </select>
          </div>
          <div className="form-control">
            <label className="label">승인 요청자 ID</label>
            <input
              type="text"
              className="input input-bordered"
              disabled
              value={selectedFacility?.memberId || ""}
            />
          </div>
          <div className="form-control">
            <label className="label">생성일</label>
            <input
              type="text"
              className="input input-bordered"
              disabled
              value={selectedFacility?.createdDate || ""}
            />
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">이미지</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div className="relative" key={index}>
              <Image
                src={image.url}
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
                  onChange={(event) => handleImageUpload(event)}
                />
              </label>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold mt-8 mb-4">리뷰</h2>
          <button
            className="btn btn-sm  btn-error mt-4"
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={selectedReviews.length === 0}
          >
            Delete
          </button>
        </div>

        <div className="overflow-x-auto">
          <CustomTable
            columns={facilityReviewColumns}
            data={facilityReviews}
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
          {!isEditing && (
            <button
              className="btn btn-warning mr-2"
              onClick={() => setIsEditing(true)}
            >
              수정하기
            </button>
          )}

          {isEditing && (
            <button
              className="btn btn-warning mr-2"
              onClick={() => handleClickEditOrConfirm(isEditing)}
            >
              완료
            </button>
          )}
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
      <Loading loading={loading} />
    </div>
  );
}
